import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
declare var pdfjsLib: any;
@Component({
  selector: 'app-root',
  template: `
<div class="row">
  <div class="col-3">
    <div>
      <input
        class="form-control form-control-sm"
        type="file"
        (change)="file($event)"
      />
    </div>
  </div>
  <div class="col-3">
    <button (click)="cng()" type="button" class="btn btn-primary btn-sm">
      change data
    </button>
  </div>
  <div class="col-1">
    <input
      type="range"
      class="form-range"
      min="0.5"
      max="1.5"
      step="0.1"
      value="0.5"
      (change)="customRange1($event)"
    />
  </div>
  <div class="col-12">
  <div class="container-fluid">
  <div id="pdf-container" style="position: absolute"></div>
</div>
</div>
</div>




  `,
})
export class App {
  name = 'Angular';
  _base64: any = {};
  rng: any = 1;
  cng() {
    this.showPdf('pdf-container', this._base64, 'red', Number(this.rng));
  }

  async file(ev: any) {
    this._base64 = await this.getBase64(ev.target.files[0]);
    this.showPdf('pdf-container', this._base64, 'red', Number(this.rng));
  }
  customRange1(ev: any) {
    console.log(ev);
    this.rng = Number(ev.target.value);
    this.showPdf('pdf-container', this._base64, 'red', this.rng);
  }
  showPdf(id: any, pdfData: any, colorList: any = null, zoom: any) {
    let that = this;
    let container: any = document.getElementById(id);
    container.innerHTML = '';
    pdfjsLib.getDocument({ data: atob(pdfData) }).promise.then((pdf: any) => {
      let pageNo = Math.floor(Math.random() * pdf._pdfInfo.numPages + 1);
      pdf.getPage(1).then(function (page: any) {
        let canvas = document.createElement('canvas');
        let context: any = canvas.getContext('2d');
        let dv = document.createElement('div');
        dv.className = 'load';
        container.appendChild(dv);
        container.appendChild(canvas);
        const viewport = page.getViewport({ scale: zoom });
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        canvas.style.width = Math.floor(viewport.width) + 'px';
        canvas.style.height = Math.floor(viewport.height) + 'px';
        document.documentElement.style.setProperty(
          '--db-show',
          canvas.style.height
        );
        page
          .render({ canvasContext: context, viewport: viewport })
          .promise.then((resp: any) => {
            if (colorList != null) {
              context.strokeStyle = colorList;
              context.strokeRect(
                that.rn(300),
                that.rn(300),
                that.rn(300),
                that.rn(300)
              );
              context.strokeRect(
                that.rn(300),
                that.rn(300),
                that.rn(300),
                that.rn(300)
              );
            }
          });
      });
    });
  }
  getBase64(pdfInput: any) {
    return new Promise((a: any, b: any) => {
      const reader = new FileReader();
      reader.onload = function (e: any) {
        a(e.target.result.split(',')[1]);
      };
      reader.onerror = function (error) {
        console.error('Error reading the file:', error);
        b(error);
      };

      reader.readAsDataURL(pdfInput);
    });
  }
  rn(num: any) {
    return Math.floor(Math.random() * num + 1);
  }
}

bootstrapApplication(App);
