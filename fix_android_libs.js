#!/usr/bin/env node

// Hook overwrides versions of gradle dependendies by editing android/project.properties file

const fs = require('fs'),
      path = require('path'),
      ini = require("ini"); // required ini devDependency


// put versions you want overwrite here
const libs = {
  "com.google.firebase:firebase-ads": "11.0.0",
  "com.google.android.gms:play-services-analytics": "11.0.0",
  "com.google.firebase:firebase-core": "11.0.0",
  "com.google.firebase:firebase-messaging": "11.0.0"
};

const project_properties_path = path.resolve(__dirname,  "../../platforms/android/project.properties");

if (Object.keys(libs).length > 0 && fs.existsSync(project_properties_path)) {
  // read project properties as ini file
  const project = ini.parse(fs.readFileSync(project_properties_path, 'UTF-8'));


  const outPutProject = {};

  Object.keys(project).forEach(key => {
    let finalValue;
    // if current item is cordova.system.library
    if (key.includes("cordova.system.library")) {

      const libraryValue =  project[key].split(":");
      const libraryName = `${libraryValue[0]}:${libraryValue[1]}`;

      if (libraryName in libs) {
        finalValue = `${libraryName}:${libs[libraryName]}`;
      } else {
        finalValue = project[key];
      }
    } else {
      finalValue =  project[key];
    }
    outPutProject[key] = finalValue;
  });

  fs.writeFileSync(project_properties_path, ini.encode(outPutProject))
}
