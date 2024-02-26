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

import android.util.Log

class TextRecognizer(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    
    override fun getName(): String {
        return "TextRecognizer"
    }

    @ReactMethod
    fun exampleMethod(message: String, callback: Callback) {
        val result = "hello from the other side"
        callback.invoke(result)
    }

    @ReactMethod
    fun processImage(imageUri: String, callback: Callback) {
        val recognizer: TextRecognizer = TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS)
        val uri: Uri = Uri.parse(imageUri)
        val image: InputImage
        try {
            image = InputImage.fromFilePath(getReactApplicationContext(), uri)
            val result = recognizer.process(image)
                .addOnSuccessListener { result ->
                    val resultText = result.text
                    for (block in result.textBlocks) {
                        val blockText = block.text
                        val blockCornerPoints = block.cornerPoints
                        val blockFrame = block.boundingBox
                        for (line in block.lines) {
                            val lineText = line.text
                            val lineCornerPoints = line.cornerPoints
                            val lineFrame = line.boundingBox
                            for (element in line.elements) {
                                val elementText = element.text
                                val elementCornerPoints = element.cornerPoints
                                val elementFrame = element.boundingBox
                            }
                        }
                    }
                    callback.invoke(resultText)
                }
                
                .addOnFailureListener { e ->
                    Log.e("TextRecognition", "Text recognition failed", e)
                }
        } catch (e: Exception) {
            Log.e("TextRecognition", "Failed to create image from URI", e)
        }
    }

}
