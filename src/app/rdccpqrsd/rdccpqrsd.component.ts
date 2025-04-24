import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  imports: [CommonModule, FormsModule],
  templateUrl: './rdccpqrsd.component.html',
  styleUrl: './rdccpqrsd.component.css',
})

export class RdccpqrsdComponent {
  formData = {
    tiporemitente: '',
    nombres: '',
    apellidos: '',
    tipodocumentoId: '',
    numerodocumento: '',
    telefono: '',
    direccion: '',
    paisId: '',
    ciudad: '',
    correoelectronico: '',
    preferenciarespuesta: '',
    asunto: '',
    anexos: [],
  };

  paises: IPais[] = [];
  tdctos: ITDcto[] = [];
  characterCount: number = 0;
  validFiles: File[] = [];
  errorMessage: string = '';
  maxTotalSizeMB: number = 50;
  maxFileCount: number = 3;
  maxFileNameLength: number = 60;
  extsAceptados: string='';
  mimeAceptados: string='';

  constructor(
    private readonly paisService: PaisService,
    private readonly tipodocumentoService: TipodocumentoService,
    private readonly formatoService: FormatoService
  ) {
    
    this.paisService.getPaises().subscribe((data: IPais[]) => {
      this.paises = data;
    });

    this.tipodocumentoService.getTiposdocumento().subscribe((data: ITDcto[]) => {
      this.tdctos = data;
    });

    this.formatoService.getFormatosPqrsdAllowed().subscribe((data: IFrmto[]) => {
      for (let algo of data) {
        this.extsAceptados += algo.extension + ', ';
        this.mimeAceptados += algo.mime + ', ';
      }
      this.extsAceptados = this.extsAceptados.slice(0, -2); // Quitamos la última coma y espacio
      this.mimeAceptados = this.mimeAceptados.slice(0, -2); // Quitamos la última coma y espacio
    });
  }

  onSubmit() {
    console.log(this.formData);
    // Aquí envío los datos del formulario al backend
  }

  calcularCaracteres() {
    this.characterCount = this.formData.asunto.length;
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
      const isValidType = this.extsAceptados.split(', ').includes(fileType || '');
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

  formatosPqrsdAceptados(){

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
    <tr><td>Nombre</td><td> ${this.formData.nombres} </td></tr>
    <tr><td>asunto</td><td style="text-align: justify"> ${this.formData.asunto} </td></tr>
    </table>`;
    const options = {
      margin: 1,
      filename: 'form-data.pdf',
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait' },
    };

    html2pdf().set(options).from(element).save();
  }
}
