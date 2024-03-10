package com.moedasar; // replace your-apps-package-name with your app’s package name
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Callback
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.text.Text
import com.google.mlkit.vision.text.TextRecognition
import com.google.mlkit.vision.text.TextRecognizer
import com.google.mlkit.vision.text.TextRecognizerOptionsInterface
import com.google.mlkit.vision.text.latin.TextRecognizerOptions
import android.net.Uri
import org.json.JSONObject
import android.util.Log
import android.graphics.BitmapFactory


class TextRecognizer(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    
    override fun getName(): String {
        return "TextRecognizer"
    }

    @ReactMethod
    fun exampleMethod(message: String, callback: Callback) {
        val result = "hello from the other side"
        callback.invoke(result)
    }

    private fun getImageDimensions(uri: Uri): JSONObject {
        val options = BitmapFactory.Options().apply {
            inJustDecodeBounds = true
        }
    
        // Use content resolver to open the image and decode bounds
        BitmapFactory.decodeStream(
            getReactApplicationContext().contentResolver.openInputStream(uri),
            null,
            options
        )
    
        val dimensions = JSONObject()
        dimensions.put("width", options.outWidth)
        dimensions.put("height", options.outHeight)
    
        return dimensions
    }

    @ReactMethod
    fun processImage(imageUri: String, callback: Callback) {
        val recognizer: TextRecognizer = TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS)
        val uri: Uri = Uri.parse(imageUri)
        val image: InputImage

        val dimentions = getImageDimensions(uri)

        try {
            image = InputImage.fromFilePath(getReactApplicationContext(), uri)
            val result = recognizer.process(image)
                .addOnSuccessListener { result ->
                    val resultText = result.text
                    val elements = mutableListOf<Map<String, Any>>()
                    for (block in result.textBlocks) {
                        val blockText = block.text
                        val blockCornerPoints = block.cornerPoints
                        val blockFrame = block.boundingBox
                        for (line in block.lines) {
                            val lineText = line.text
                            val lineCornerPoints = line.cornerPoints
                            val lineFrame = line.boundingBox
                            for (element in line.elements) {
                                if (element != null) {
                                    val elementText = element.text
                                    val elementCornerPoints = element.cornerPoints
                                    val elementFrame = element.boundingBox
                                    // Get the x,y coordinates of the element's corners
                                    val corners = mutableListOf<JSONObject>()
                                    if (elementCornerPoints != null) {
                                        for (cornerPoint in elementCornerPoints) {
                                            val x = cornerPoint.x.toFloat()
                                            val y = cornerPoint.y.toFloat()
                                    
                                            val cornerObject = JSONObject()
                                            cornerObject.put("x", x)
                                            cornerObject.put("y", y)
                                    
                                            corners.add(cornerObject)
                                        }
                                        // Add the element to the list of elements
                                        elements.add(
                                            mapOf(
                                                "text" to elementText,
                                                "corners" to corners,
                                                "frame" to mapOf(
                                                    Pair("left", elementFrame?.left ?: 0f),
                                                    Pair("top", elementFrame?.top ?: 0f),
                                                    Pair("right", elementFrame?.right ?: 0f),
                                                    Pair("bottom", elementFrame?.bottom ?: 0f)
                                                )
                                            )
                                        )
                                    }
                                }
                            }
                        }
                    }

                    val pricesAndPositions = JSONObject()

                    val textList = resultText.split("\n")
                    val regex = Regex("\\d+[.,]\\d{0,2}[\\s\\n]")
                    val relevantText = regex.findAll(resultText)
                        .map { it.value.replace("\n", "") }
                        .toList()

                    for (i in 0 until relevantText.size) {
                        val price = relevantText[i]
                        for (j in 0 until elements.size) {
                            val element = elements[j]

                            if (price.contains(element["text"] as String)) {
                                pricesAndPositions.put(price, element["corners"])
                                if (element["text"] == price) {
                                    pricesAndPositions.put(price, (element["corners"] as List<Map<String, Float>>)[0])
                                } else {
                                    // Verificar se o próximo elemento inclui o preço
                                    val nextElement = elements.getOrNull(i + 1)
                                    if (nextElement != null && price.contains(nextElement["text"] as String)) {
                                        pricesAndPositions.put(price, (nextElement["corners"] as List<Map<String, Float>>)[0])
                                    }
                                }
                            }
                        }
                    }
                    val result = JSONObject();
                    result.put("dimentions",dimentions)
                    result.put("pricesAndPositions",pricesAndPositions)
                    //pricesAndPositions.put("elements", elements)
                    //pricesAndPositions.put("prices", relevantText)
                    //pricesAndPositions.put("text", resultText)
                    callback.invoke(result.toString())
            }.addOnFailureListener { e ->
                Log.e("TextRecognition", "Text recognition failed", e)
            }
        } catch (e: Exception) {
            Log.e("TextRecognition", "Failed to create image from URI", e)
        }
    }

}
