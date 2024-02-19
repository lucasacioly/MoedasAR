package com.moedasar; // replace your-apps-package-name with your app’s package name
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Callback

import android.util.Log

class TextRecognition(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "TextRecognition"
    }

    @ReactMethod
    fun exampleMethod(message: String, callback: Callback) {
        val result = "hello from the other side"
        callback.invoke(result)
    }
}
