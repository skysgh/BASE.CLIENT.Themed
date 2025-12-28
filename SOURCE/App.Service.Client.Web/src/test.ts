// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);

// ✅ FIX: Use import.meta for webpack 5 compatibility
// This works with modern webpack and doesn't require 'require' types

// @ts-ignore - webpack will handle this at build time
const context = import.meta.webpackContext('./', {
  recursive: true,
  regExp: /\.spec\.ts$/
});

// Load all spec files
context.keys().forEach(context);
