import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { PaisService } from '../servicios/pais.service';
import { TipodocumentoService } from '../servicios/tipodocumento.service';
import { FormatoService } from '../servicios/formato.service';

// @ts-ignore
import html2pdf from 'html2pdf.js';

interface IPais {
  id: string;
  nombre: string;
}

interface ITDcto {
  id: string;
  nombre: string;
}

interface IFrmto {
  mime: string;
  extension: string;
}

@Component({
  selector: 'app-rdccpqrsd',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './rdccpqrsd.component.html',
  styleUrl: './rdccpqrsd.component.css',
})

export class RdccpqrsdComponent implements OnInit {
  formData! : FormGroup;

  paises: IPais[] = [];
  tdctos: ITDcto[] = [];
  characterCount: number = 0;
  validFiles: File[] = [];
  errorMessage: string = '';
  maxTotalSizeMB: number = 50;
  maxFileCount: number = 3;
  maxFileNameLength: number = 60;
  extsAceptados: string = '';
  mimeAceptados: string = '';

  nombres_obligatorio = false;
  apellidos_obligatorio = false;
  direccion_obligatorio = false;
  ciudad_obligatorio = false;
  paisId_obligatorio = false;
  correoele_obligatorio = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly paisService: PaisService,
    private readonly tipodocumentoService: TipodocumentoService,
    private readonly formatoService: FormatoService
  ) {

    this.paisService.getPaises().subscribe((data: IPais[]) => {
      this.paises = data;
    });

    this.tipodocumentoService
      .getTiposdocumento()
      .subscribe((data: ITDcto[]) => {
        this.tdctos = data;
      });

    this.formatoService
      .getFormatosPqrsdAllowed()
      .subscribe((data: IFrmto[]) => {
        for (let algo of data) {
          this.extsAceptados += algo.extension + ', ';
          this.mimeAceptados += algo.mime + ', ';
        }
        this.extsAceptados = this.extsAceptados.slice(0, -2); // Quitamos la última coma y espacio
        this.mimeAceptados = this.mimeAceptados.slice(0, -2); // Quitamos la última coma y espacio
      });
  }

  ngOnInit(): void {
    this.formData = this.fb.group({
      tiporemitente: ['', Validators.required],
      nombres: [''],
      apellidos: [''],
      tipodocumentoId: [''],
      numerodocumento: [''],
      telefono: [''],
      direccion: [''],
      paisId: [''],
      ciudad: [''],
      correoelectronico: ['', Validators.email],
      preferenciarespuesta: ['', Validators.required],
      asunto: ['', Validators.required],
      anexos: [null],
      habeasdata: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.formData.valid) {
      console.log('Formulario enviado:', this.formData.value);
      alert('Formulario válido y enviado.');
      // Aquí envío los datos del formulario al backend
    } else {
      alert('Formulario inválido. Revisa los campos y los archivos.');
    }
  }

  calcularCaracteres() {
    this.characterCount =
      this.formData.controls['asunto'].value != null
        ? this.formData.controls['asunto'].value.length
        : 0;
  }

  validarAnexos(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (!files) return;

    this.validFiles = [];
    this.errorMessage = '';

    let totalSize = 0;

    if (files.length > this.maxFileCount) {
      this.errorMessage = `Puede subir un máximo de ${this.maxFileCount} archivos.`;
      return;
    }

    for (const file of Array.from(files)) {
      const fileType = file.name.split('.').pop()?.toLowerCase();
      const isValidType = this.extsAceptados
        .split(', ')
        .includes(fileType || '');
      if (!isValidType) {
        this.errorMessage = `El tipo de archivo "${file.name}" no está permitido.`;
        return;
      }

      if (file.name.length > this.maxFileNameLength) {
        this.errorMessage = `El nombre del archivo "${file.name}" excede longitud máxima.`;
        return;
      }

      totalSize += file.size / (1024 * 1024); // Convert size to MB
      if (totalSize > this.maxTotalSizeMB) {
        this.errorMessage = `Tamaño total de archivos excede límite.`;
        return;
      }

      this.validFiles.push(file);
    }
  }

  valida_prefresp(event: Event) {
    const select = event.target as HTMLSelectElement;
    const selectedValue = select.value;

    if (selectedValue === '0') {
      this.formData.controls['correoelectronico'].setValidators([
        Validators.required,
        Validators.email,
      ]);

      this.nombres_obligatorio = false;
      this.apellidos_obligatorio = false;
      this.direccion_obligatorio = false;
      this.ciudad_obligatorio = false;
      this.paisId_obligatorio = false;
      this.correoele_obligatorio = true;
    } else {
      this.formData.controls['nombres'].setValidators([Validators.required]);
      this.nombres_obligatorio = true;

      this.formData.controls['apellidos'].setValidators([Validators.required]);
      this.apellidos_obligatorio = true;

      this.formData.controls['direccion'].setValidators([Validators.required]);
      this.direccion_obligatorio = true;

      this.formData.controls['ciudad'].setValidators([Validators.required]);
      this.ciudad_obligatorio = true;

      this.formData.controls['paisId'].setValidators([Validators.required]);
      this.paisId_obligatorio = true;

      this.correoele_obligatorio = false;
    }

    this.formData.controls['nombres'].updateValueAndValidity();
    this.formData.controls['apellidos'].updateValueAndValidity();
    this.formData.controls['direccion'].updateValueAndValidity();
    this.formData.controls['ciudad'].updateValueAndValidity();
    this.formData.controls['paisId'].updateValueAndValidity();
    this.formData.controls['correoelectronico'].updateValueAndValidity();
  }

  generarPDF() {
    /**
    const doc = new jsPDF();
    doc.text(`Formulario de Registro`, 20, 20);
    doc.text(`Nombre: ${this.formData.nombres}`, 20, 40);
    doc.text(`Correo Electrónico: ${this.formData.correoelectronico}`, 20, 60);
    // doc.save('registro.pdf');
    doc.output('pdfobjectnewwindow', { filename: 'registro.pdf' });
    */
    let element = document.createElement('div');
    element.innerHTML = `<table>
    <tr><td>Señores</td></tr><tr><td><strong>Ministerio de la Igualdad</strong></td></tr>
    <tr><td>motivo de la PQRSD: </td></tr>
    <tr><td style="text-align: justify"> ${this.formData.controls['asunto'].value} </td></tr>`;

    element.innerHTML += `<tr><td>&nbsp;</td></tr>`;
    if (this.validFiles.length > 0) {
      element.innerHTML += `<tr><td>Archivos anexos:</td></tr>`;
      for (const file of Array.from(this.validFiles)) {
        const fileName = file.name;
        /**
        const fileSize = (file.size / (1024 * 1024)).toFixed(2); // Convertir a MB
        element.innerHTML += `<tr><td>${fileName} (${fileSize} MB)</td></tr>`;
        */
        element.innerHTML += `<tr style="width: 100%"><td>${fileName} (${file.size} bytes)</td></tr>`;
      }
    }
    
    element.innerHTML += `<tr><td>&nbsp;</td></tr>`;
    element.innerHTML += `<tr><td>Atentamente,</td></tr><tr><td>&nbsp;</td></tr>`;
    if (this.formData.controls['tiporemitente'].value === '1') {
      
      if (this.formData.controls['nombres'].value != null) {
        element.innerHTML += `<tr><td> ${this.formData.controls['nombres'].value} ${this.formData.controls['apellidos'].value} </td></tr>`;
      }
      if (this.formData.controls['tipodocumentoId'].value != null) {
        element.innerHTML += `<tr><td> ${this.formData.controls['tipodocumentoId'].value} ${this.formData.controls['numerodocumento'].value} </td></tr>`;
      }

      if (this.formData.controls['correoelectronico'].value != null) {
        element.innerHTML += `<tr><td>Correo Electrónico ${this.formData.controls['correoelectronico'].value} </td></tr>`;
      }
    }
    
    element.innerHTML += `</table>`;
    const options = {
      margin: 1,
      filename: 'form-data.pdf',
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait' },
    };

    html2pdf().set(options).from(element).save();
  }
}
