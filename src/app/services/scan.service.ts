import { Injectable } from '@angular/core';
import {
    BarcodeScanner,
    BarcodeFormat,
    LensFacing,
    GoogleBarcodeScannerModuleInstallState 
  } from '@capacitor-mlkit/barcode-scanning';
  import { MensajesService } from 'src/app/services/mensajes.service';

@Injectable({
    providedIn: 'root'
  })
  export class ScanService {

    constructor(private mensajeService : MensajesService) {
        BarcodeScanner.removeAllListeners().then(() => {
          BarcodeScanner.addListener('googleBarcodeScannerModuleInstallProgress', (event) => {
            if (event.state === GoogleBarcodeScannerModuleInstallState.COMPLETED) {
                this.mensajeService.Info("Camara Lista");
            }
          });
        });
      }
    
      async scan() {
        const available = await BarcodeScanner.isGoogleBarcodeScannerModuleAvailable();
        if (!available) {
          return null;
        }
        
        try {
          const { barcodes } = await BarcodeScanner.scan();
          return barcodes;
        } catch {
          return null;
        }
      }
    
      async init() {
        const result = await BarcodeScanner.isGoogleBarcodeScannerModuleAvailable();
        if (result.available) {
          return;
        }
    
        await BarcodeScanner.installGoogleBarcodeScannerModule();
      }

    
     
  }