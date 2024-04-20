## Issues ##


### Warning

```
WARNING in ./node_modules/pdfjs-dist/build/pdf.js Module not found: 
Error: Can't resolve 'zlib' in 'C:\MyProject\node_modules\pdfjs-dist\build'
```

YOu can (but should you?) ignore the warning
((https://stackoverflow.com/questions/51023482/warning-in-node-modules-pdfjs-dist-build-pdf-js)):

```
"build": {
    "builder": "@angular-devkit/build-angular:browser",
    "options": {
        "allowedCommonJsDependencies": ["ng2-pdf-viewer"],
    }
}
```
