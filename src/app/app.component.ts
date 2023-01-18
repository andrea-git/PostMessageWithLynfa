import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div style="display: flex; flex-direction: column;">
      <textarea #textarea rows="5" cols="33"></textarea>
      ELABORAZIONE RECORD: {{ nRec }} FILE: {{ nFile }} TOT FILES:
      {{ totFiles }} TYPE:
      {{ fileFormat }}
      <!-- <button (click)="openFile()" style="width: 250px;">Open file</button>
      <button (click)="testSize()" style="width: 250px;">Test size</button> -->
      <!-- <button
        (click)="getRecords()"
        style="width: 250px;"
        [disabled]="!fileOpened"
      >
        Get records
      </button> -->
      <!-- <button (click)="getLynfaData()" style="width: 250px;">
        Get Lynfa Data
      </button>
      <button (click)="updateLynfaData()" style="width: 250px;">
        Update Lynfa Data
      </button> -->
      <button (click)="callPgmForeground()" style="width: 250px;">
        Call COBOL program in foreground
      </button>
      <button (click)="login()" style="width: 250px;">Login</button>
      <button (click)="callPgmBackground()" style="width: 250px;">
        Call COBOL program in background
      </button>
      <button (click)="hidePage()" style="width: 250px;">
        Hide Angular page
      </button>
      <button (click)="closePage()" style="width: 250px;">
        Close Angular page
      </button>
      <button (click)="lookUpDitte()" style="width: 250px;">
        LookUp ditte
      </button>
      <button (click)="openPartitario()" style="width: 250px;">
        Open PARTITARIO
      </button>
      <button (click)="listFascicoli()" style="width: 250px;">
        LISTA FASCICOLI
      </button>
      <button (click)="getParImp()" style="width: 250px;">
        PARAMETRI MAPPATURA
      </button>
      <button (click)="getPdcCorr()" style="width: 250px;">
        CORRELAZIONI PDC
      </button>
      <button (click)="getFascicolo()" style="width: 250px;">
        FASCICOLO (2020 DITTA 2)
      </button>
      <button (click)="updateDitte()" style="width: 250px;">
        REFRESH DITTE (2)
      </button>
      <button (click)="sendChunk()" style="width: 250px;">
        TEST CSV CHUNK
      </button>
      <button (click)="callMsitbs()" style="width: 250px;">
        MSITBS (6280)
      </button>
      <button (click)="gesDitta()" style="width: 250px;">
        ANADITTE (1031)
      </button>
    </div>
  `,
})
export class AppComponent {
  nRec = 0;
  nFile = 0;
  totFiles = 0;
  fileFormat = '';
  calledPgm = '';
  inBackground = false;
  risultato = '';
  str = '';
  nSRChunk = 0;
  payloadSRData = '';

  mockRettifiche1 =
    'RGVub21pbmF6aW9uZTtQSVZBO0NGO0Zhc2NpY29sb05vbWU7UGVyaW9kb0luaXppbztQZXJpb2RvRmluZTtDYXVzYWxlRGVzYztSZXR0aWZpY2FJZDtSZXR0aWZpY2FEZXNjO0JpbENvbnRvQ29kaWNlO0JpbENvbnRvRGVzYztDb250Q29udG9Db2RpY2U7Q29udENvbnRvRGVzYztEYXJlO0F2ZXJlDQpBU1NJICYgU0FTU0kgREkgTUFSR0hFOzEyMzEyMzEyMzEyOzEyMzEyMzEyMzEyO0dNRzswMS8wMS8yMDE5OzMxLzEyLzIwMTk7QWx0cmUgcmV0dGlmaWNoZTsxNzIzO2VsaW1pbmF6aW9uZSB2YWxvcmkgbmVnYXRpdmk7MTY3MDtCYW5jaGUgYy9jIGF0dGl2aTsyNDA1MDAxO0JhbmNoZSBjL2M7NjcwLDQ1OzA7DQpBU1NJICYgU0FTU0kgREkgTUFSR0hFOzEyMzEyMzEyMzEyOzEyMzEyMzEyMzEyO0dNRzswMS8wMS8yMDE5OzMxLzEyLzIwMTk7QWx0cmUgcmV0dGlmaWNoZTsxNzIzO2VsaW1pbmF6aW9uZSB2YWxvcmkgbmVnYXRpdmk7MzA4MjtEZWJpdGkgdmVyc28gYW1taW5pc3RyYXRvcmkgbyBzaW5kYWNpIHBlciBlbW9sdW1lbnRpIG8gYWx0cm87NTIwNTI5MDtEZWJpdGkgZGl2ZXJzaTswOzY3MCw0NDsNCkFTU0kgJiBTQVNTSSBESSBNQVJHSEU7MTIzMTIzMTIzMTI7MTIzMTIzMTIzMTI7R01HOzAxLzAxLzIwMTk7MzEvMTIvMjAxOTtSYXRlaTsxODA2O2ZhdHR1cmUgZGEgZW1ldHRlcmU7MzYzODtSaWNhdmkgZGkgcGVyc29uYWxlIGRpc3RhY2NhdG87NTgwNTAxMDtNZXJjaSBjL3ZlbmRpdGU7MDs0NTAwOw0KQVNTSSAm';
  mockRettifiche2 =
    'IFNBU1NJIERJIE1BUkdIRTsxMjMxMjMxMjMxMjsxMjMxMjMxMjMxMjtHTUc7MDEvMDEvMjAxOTszMS8xMi8yMDE5O1JhdGVpOzE4MDY7ZmF0dHVyZSBkYSBlbWV0dGVyZTsxMTkwO0NyZWRpdGkgZG9jdW1lbnRhdGkgZGEgZmF0dHVyZTsxNTA1MDQ1O0ZhdHR1cmUgZGEgZW1ldHRlcmU7NDUwMDswOw0KQVNTSSAmIFNBU1NJIERJIE1BUkdIRTsxMjMxMjMxMjMxMjsxMjMxMjMxMjMxMjtHTUc7MDEvMDEvMjAxOTszMS8xMi8yMDE5O0FtbW9ydGFtZW50aTsxODA3O2FtbW9ydGFtZW50aTs0MDc0O0FtbW9ydGFtZW50byBkaXJpdHRpIGRpIGJyZXZldHRvIGluZHVzdHJpYWxlIGUgZGkgdXRpbGl6em8gZGkgb3BlcmUgZGVsbCdpbmdlZ25vOzc1MzAwNDA7QW1tLnRvIGFycmVkYW1lbnRvOzUwMiwzNDswOw0KQVNTSSAmIFNBU1NJIERJIE1BUkdIRTsxMjMxMjMxMjMxMjsxMjMxMjMxMjMxMjtHTUc7MDEvMDEvMjAxOTszMS8xMi8yMDE5O0FtbW9ydGFtZW50aTsxODA3O2FtbW9ydGFtZW50aTsxNjA7KEZvbmRpIGRpIGFtbW9ydGFtZW50byk7NzMwMDQwO0YuZG8gYW1tLnRvIGFycmVkYW1lbnRvOzA7NTAyLDM0Ow0KQVNTSSAmIFNBU1NJIERJIE1BUkdIRTsxMjMxMjMxMjMxMjsxMjMxMjMxMjMxMjtHTUc7MDEvMDEvMjAxOTszMS8xMi8yMDE5O0FtbW9ydGFtZW50aTsxODA4O2FtbW9ydGFtZW50aTs0MDc0O0FtbW9ydGFtZW50byBkaXJpdHRpIGRpIGJyZXZldHRvIGluZHVzdHJpYWxlIGUgZGkgdXRpbGl6em8gZGkgb3BlcmUg';
  mockRettifiche3 =
    'ZGVsbCdpbmdlZ25vOzc1MjAwMTA7QW1tLnRvIG1hY2NoLnVmZmljaW87ODExLDEyOzA7DQpBU1NJICYgU0FTU0kgREkgTUFSR0hFOzEyMzEyMzEyMzEyOzEyMzEyMzEyMzEyO0dNRzswMS8wMS8yMDE5OzMxLzEyLzIwMTk7QW1tb3J0YW1lbnRpOzE4MDg7YW1tb3J0YW1lbnRpOzE2MDsoRm9uZGkgZGkgYW1tb3J0YW1lbnRvKTs3MjAwMTA7Ri5kbyBhbW0udG8gbWFjY2gudWZmaWNpbzswOzgxMSwxMjsNCkFTU0kgJiBTQVNTSSBESSBNQVJHSEU7MTIzMTIzMTIzMTI7MTIzMTIzMTIzMTI7R01HOzAxLzAxLzIwMTk7MzEvMTIvMjAxOTtBbW1vcnRhbWVudGk7MTgwOTthbW1vcnRhbWVudGk7NDA3NDtBbW1vcnRhbWVudG8gZGlyaXR0aSBkaSBicmV2ZXR0byBpbmR1c3RyaWFsZSBlIGRpIHV0aWxpenpvIGRpIG9wZXJlIGRlbGwnaW5nZWdubzs3NTI1MDE1O0FtbS50byBhdXRvdmV0dHVyZTs2MTQsMjI7MDsNCkFTU0kgJiBTQVNTSSBESSBNQVJHSEU7MTIzMTIzMTIzMTI7MTIzMTIzMTIzMTI7R01HOzAxLzAxLzIwMTk7MzEvMTIvMjAxOTtBbW1vcnRhbWVudGk7MTgwOTthbW1vcnRhbWVudGk7MTYwOyhGb25kaSBkaSBhbW1vcnRhbWVudG8pOzcyNTAxNTtGLmRvIGFtbS50byBhdXRvdmV0dHVyZTswOzYxNCwyMjsNCkFTU0kgJiBTQVNTSSBESSBNQVJHSEU7MTIzMTIzMTIzMTI7MTIzMTIzMTIzMTI7R01HOzAxLzAxLzIwMTk7MzEvMTIvMjAxOTtBbHRyZSByZXR0aWZpY2hlOzE4MTA7Z2lyb2NvbnRvOzE2NzA7QmFuY2hlIGMv';
  mockRettifiche4 =
    'YyBhdHRpdmk7MjQwNTAwMTtCYW5jaGUgYy9jOzEwMDQsMTE7MDsNCkFTU0kgJiBTQVNTSSBESSBNQVJHSEU7MTIzMTIzMTIzMTI7MTIzMTIzMTIzMTI7R01HOzAxLzAxLzIwMTk7MzEvMTIvMjAxOTtBbHRyZSByZXR0aWZpY2hlOzE4MTA7Z2lyb2NvbnRvOzIxMTE7Q2Fzc2EgY29udGFudGk7MjQxNTAwNTtEZW5hcm8gaW4gY2Fzc2E7MDszMTEzLDQ1Ow0KQVNTSSAmIFNBU1NJIERJIE1BUkdIRTsxMjMxMjMxMjMxMjsxMjMxMjMxMjMxMjtHTUc7MDEvMDEvMjAxOTszMS8xMi8yMDE5O0FsdHJlIHJldHRpZmljaGU7MTgxMDtnaXJvY29udG87MTY3MTtCYW5jaGUgYy9jIGF0dGl2aTsyNDA1MDAyO0JhbmNoZSBjL2M7ODUwOzA7DQpBU1NJICYgU0FTU0kgREkgTUFSR0hFOzEyMzEyMzEyMzEyOzEyMzEyMzEyMzEyO0dNRzswMS8wMS8yMDE5OzMxLzEyLzIwMTk7QWx0cmUgcmV0dGlmaWNoZTsxODEwO2dpcm9jb250bzsxNjcyO0JhbmNoZSBjL2MgYXR0aXZpOzI0MDUwMDM7QmFuY2hlIGMvYzsxMjU5LDM0OzA7DQpBU1NJICYgU0FTU0kgREkgTUFSR0hFOzEyMzEyMzEyMzEyOzEyMzEyMzEyMzEyO0dNRzswMS8wMS8yMDE5OzMxLzEyLzIwMTk7QWx0cmUgcmV0dGlmaWNoZTsxODExO2dpcm9jb250bzsxNjcwO0JhbmNoZSBjL2MgYXR0aXZpOzI0MDUwMDE7QmFuY2hlIGMvYzswOzcxMCw0NTsNCkFTU0kgJiBTQVNTSSBESSBNQVJHSEU7MTIzMTIzMTIzMTI7MTIzMTIzMTIzMTI7R01HOzAxLzAxLzIwMTk7MzEvMTIvMjAxOTtBbHRy';
  mockRettifiche5 =
    'ZSByZXR0aWZpY2hlOzE4MTE7Z2lyb2NvbnRvOzIxMTE7Q2Fzc2EgY29udGFudGk7MjQxNTAwNTtEZW5hcm8gaW4gY2Fzc2E7MDsxMDQxLDIyOw0KQVNTSSAmIFNBU1NJIERJIE1BUkdIRTsxMjMxMjMxMjMxMjsxMjMxMjMxMjMxMjtHTUc7MDEvMDEvMjAxOTszMS8xMi8yMDE5O0FsdHJlIHJldHRpZmljaGU7MTgxMTtnaXJvY29udG87MTY3MTtCYW5jaGUgYy9jIGF0dGl2aTsyNDA1MDAyO0JhbmNoZSBjL2M7MDsyMzM7DQpBU1NJICYgU0FTU0kgREkgTUFSR0hFOzEyMzEyMzEyMzEyOzEyMzEyMzEyMzEyO0dNRzswMS8wMS8yMDE5OzMxLzEyLzIwMTk7QWx0cmUgcmV0dGlmaWNoZTsxODExO2dpcm9jb250bzsxNjcyO0JhbmNoZSBjL2MgYXR0aXZpOzI0MDUwMDM7QmFuY2hlIGMvYzsxOTg0LDY3OzA7DQpBU1NJICYgU0FTU0kgREkgTUFSR0hFOzEyMzEyMzEyMzEyOzEyMzEyMzEyMzEyO0dNRzswMS8wMS8yMDE5OzMxLzEyLzIwMTk7QW1tb3J0YW1lbnRpOzE4MTI7YW1tb3J0YW1lbnRpOzQwNzQ7QW1tb3J0YW1lbnRvIGRpcml0dGkgZGkgYnJldmV0dG8gaW5kdXN0cmlhbGUgZSBkaSB1dGlsaXp6byBkaSBvcGVyZSBkZWxsJ2luZ2Vnbm87NzUxMDAxMDtBbW0udG8gYXR0cmV6emF0dXJlIDwgNTE2OzE5MCw0NTswOw0KQVNTSSAmIFNBU1NJIERJIE1BUkdIRTsxMjMxMjMxMjMxMjsxMjMxMjMxMjMxMjtHTUc7MDEvMDEvMjAxOTszMS8xMi8yMDE5O0FtbW9ydGFtZW50aTsxODEyO2FtbW9ydGFtZW50aTs0MDc0O0FtbW9ydGFt';
  mockRettifiche6 =
    'ZW50byBkaXJpdHRpIGRpIGJyZXZldHRvIGluZHVzdHJpYWxlIGUgZGkgdXRpbGl6em8gZGkgb3BlcmUgZGVsbCdpbmdlZ25vOzc1MTUwMDU7QW1tLnRvIGF0dHJlenphdHVyZTsyMzgsNzc7MDsNCkFTU0kgJiBTQVNTSSBESSBNQVJHSEU7MTIzMTIzMTIzMTI7MTIzMTIzMTIzMTI7R01HOzAxLzAxLzIwMTk7MzEvMTIvMjAxOTtBbW1vcnRhbWVudGk7MTgxMjthbW1vcnRhbWVudGk7MTYwOyhGb25kaSBkaSBhbW1vcnRhbWVudG8pOzcxNTAxMDtGLmRvIGFtbS50byBhdHRyZXp6YXR1cmU7MDsxOTAsNDU7DQpBU1NJICYgU0FTU0kgREkgTUFSR0hFOzEyMzEyMzEyMzEyOzEyMzEyMzEyMzEyO0dNRzswMS8wMS8yMDE5OzMxLzEyLzIwMTk7QW1tb3J0YW1lbnRpOzE4MTI7YW1tb3J0YW1lbnRpOzE2MDsoRm9uZGkgZGkgYW1tb3J0YW1lbnRvKTs3MTUwMDU7Ri5kbyBhbW0udG8gYXR0cmV6emF0dXJlOzA7MjM4LDc3Ow0K';

  @ViewChild('textarea', { static: true })
  texarea: ElementRef;
  parentEmbedded: any;
  private appid: string;
  @HostListener('window:message', ['$event'])
  onMessage(event: any) {
    this.receiveMessage(event);
  }

  constructor() {}

  receiveMessage(event: MessageEvent) {
    debugger;
    if (
      !!event &&
      !!event.data &&
      !!event.data.cmd &&
      !!event.data.appid &&
      !this.appid &&
      event.data.cmd === 'start'
    ) {
      this.appid = event.data.appid;
      console.log('[APP2] - imposto appid: ', this.appid);
      this.parentEmbedded = event.source;
      this.parentEmbedded.postMessage(
        { action: 'opened', appid: this.appid },
        '*'
      );
      return;
    }

    if (
      !!event &&
      !!event.data &&
      event.data &&
      event.data.cmd === 'msg' &&
      event.data.payload.payloadOp
    ) {
      switch (event.data.payload.payloadOp) {
        case 'errEncBase64':
          this.texarea.nativeElement.value = event.data.payload.payloadInfo;
          this.endProcedure();
          break;
        case 'statusReceiving':
          this.texarea.nativeElement.value =
            event.data.payload.payloadStatus +
            ' - ' +
            event.data.payload.payloadInfo;
          this.putRettifiche();
        case 'statusPrms':
        case 'receivingNext':
          if (event.data.payload.payloadStatus === 0) {
            if (this.inBackground) {
              this.callBackGround();
            } else {
              if (this.calledPgm === 'RECEIVECHUNK') {
                this.receiveChunk();
              } else {
                this.hidePage();
              }
            }
          } else {
            this.texarea.nativeElement.value =
              'STATUS: ' +
              event.data.payload.payloadStatus +
              ' DATA: ' +
              event.data.payload.payloadData +
              ' INFO: ' +
              event.data.payload.payloadInfo;
            this.endProcedure();
          }
          break;
        case 'statusLogin':
          if (event.data.payload.payloadStatus === 0) {
            this.texarea.nativeElement.value = JSON.stringify(
              event.data.payload.payloadLogin
            );
          } else {
            this.texarea.nativeElement.value = event.data.payload.payloadInfo;
          }
          break;
        case 'statusCall':
          if (event.data.payload.payloadStatus === 0) {
            switch (this.calledPgm) {
              case 'MSITBS':
              case 'LOOKUPDITTE':
              case 'UPDATEDITTE':
              case 'GETFASCICOLO':
                this.nFile = 0;
                this.totFiles = 0;
                this.getRecords();
                break;
              case 'LISTFASCICOLI':
                if (event.data.payload.payloadStatus === 0) {
                  this.texarea.nativeElement.value = JSON.stringify(
                    event.data.payload
                  );
                }
                break;
              case 'GETPARIMP':
                if (event.data.payload.payloadStatus === 0) {
                  this.texarea.nativeElement.value = JSON.stringify(
                    event.data.payload.payloadData
                  );
                }
                break;

              case 'PUTRETTIFICHE':
                this.texarea.nativeElement.value =
                  'STATUS: ' +
                  event.data.payload.payloadStatus +
                  ' - INFO: ' +
                  event.data.payload.payloadInfo;
                break;

              case 'ANADITTE':
              case 'GETPDCCORR':
                if (event.data.payload.payloadStatus === 0) {
                  if (event.data.payload.payloadTotFiles > 0) {
                    this.nFile = 0;
                    this.totFiles = 0;
                    this.getRecords();
                  } else {
                    this.nRec = 0;
                    this.totFiles = 0;
                    this.nFile = 0;
                    this.fileFormat = '';
                    this.endProcedure();
                  }
                } else {
                  this.nRec = 0;
                  this.totFiles = 0;
                  this.fileFormat = '';
                  this.endProcedure();
                }
                break;
              default:
                break;
            }
          } else {
            this.texarea.nativeElement.value =
              'STATUS: ' +
              event.data.payload.payloadStatus +
              ' DATA: ' +
              event.data.payload.payloadData +
              ' INFO: ' +
              event.data.payload.payloadInfo;
            this.endProcedure();
          }
          break;
        case 'sendingChunk':
          this.str = this.risultato;
          this.risultato = this.str.concat(event.data.payload.payloadData);
          this.fileFormat = event.data.payload.payloadFormat;
          this.getRecords();
          this.nRec++;
          break;
        case 'endSendNext':
          this.cambiofile();
          this.getRecords();
          break;
        case 'startSend':
          this.getRecords();
          this.totFiles = event.data.payload.payloadTotFiles;
          this.nFile = event.data.payload.payloadPrgFile;
          this.fileFormat = event.data.payload.payloadFormat;
          this.risultato = '';
          break;
        case 'endSend':
          console.log(this.risultato);
          this.texarea.nativeElement.value = atob(this.risultato);
          this.endProcedure();
          break;
        default:
          break;
      }
    }
  }

  endProcedure() {
    this.parentEmbedded.postMessage({ cmd: 'showMe' }, '*');
  }

  openFile() {
    this.nRec = 0;
    this.parentEmbedded.postMessage(
      { cmd: 'openFile', payload: this.texarea.nativeElement.value },
      '*'
    );
  }

  testSize() {
    this.nRec = 0;
    this.parentEmbedded.postMessage({ cmd: 'testSize' }, '*');
  }

  getRecords() {
    this.parentEmbedded.postMessage({ cmd: 'getRecords' }, '*');
  }

  closePage() {
    this.parentEmbedded.postMessage({ cmd: 'close' }, '*');
  }

  hidePage() {
    this.parentEmbedded.postMessage({ cmd: 'hide' }, '*');
  }

  callBackGround() {
    this.parentEmbedded.postMessage({ cmd: 'call' }, '*');
    this.inBackground = false;
  }

  callPgmForeground() {
    this.nRec = 0;
    this.parentEmbedded.postMessage(
      { cmd: 'prms', payload: this.texarea.nativeElement.value },
      '*'
    );
  }

  callPgmBackground() {
    this.inBackground = true;
    this.nRec = 0;
    this.parentEmbedded.postMessage(
      { cmd: 'prms', payload: this.texarea.nativeElement.value },
      '*'
    );
  }

  openPartitario() {
    this.texarea.nativeElement.value = '';
    this.calledPgm = 'PARTITARIO';
    this.nRec = 0;
    this.parentEmbedded.postMessage(
      {
        cmd: 'prms',
        payload:
          'functionName=OpenPartitario;companyId=3;majorRelease=1;minorRelease=0;codConto=5805010;tipoConto=0;sdate=01/01/2020;edate=31/12/2020;',
      },
      '*'
    );
  }

  listFascicoli() {
    this.texarea.nativeElement.value = '';
    this.calledPgm = 'LISTFASCICOLI';
    this.nRec = 0;
    this.parentEmbedded.postMessage(
      {
        cmd: 'prms',
        payload:
          'functionName=ListFascicoli;companyId=2;majorRelease=1;minorRelease=0;',
      },
      '*'
    );
  }

  receiveChunk() {
    this.nSRChunk++;
    switch (this.nSRChunk) {
      case 1:
        this.payloadSRData = this.mockRettifiche1;
        break;
      case 2:
        this.payloadSRData = this.mockRettifiche2;
        break;
      case 3:
        this.payloadSRData = this.mockRettifiche3;
        break;
      case 4:
        this.payloadSRData = this.mockRettifiche4;
        break;
      case 5:
        this.payloadSRData = this.mockRettifiche5;
        break;
      case 6:
        this.payloadSRData = this.mockRettifiche6;
        break;
      default:
        this.payloadSRData = '';
        break;
    }

    if (this.payloadSRData === '') {
      this.parentEmbedded.postMessage(
        {
          cmd: 'endReceivingChunk',
          payload: '',
        },
        '*'
      );
    } else {
      this.parentEmbedded.postMessage(
        {
          cmd: 'receivingChunk',
          payload: this.payloadSRData,
        },
        '*'
      );
    }
  }

  getParImp() {
    this.texarea.nativeElement.value = '';
    this.calledPgm = 'GETPARIMP';
    this.nRec = 0;
    this.parentEmbedded.postMessage(
      {
        cmd: 'prms',
        payload:
          'functionName=GetParImp;companyId=2;year=2018;nBil=0;majorRelease=1;minorRelease=0;',
      },
      '*'
    );
  }

  getPdcCorr() {
    this.texarea.nativeElement.value = '';
    this.calledPgm = 'GETPDCCORR';
    this.nRec = 0;
    this.parentEmbedded.postMessage(
      {
        cmd: 'prms',
        payload:
          'functionName=GetPdcCorr;companyId=2;year=2018;nBil=0;majorRelease=1;minorRelease=0;',
      },
      '*'
    );
  }

  getFascicolo() {
    this.texarea.nativeElement.value = '';
    this.calledPgm = 'GETFASCICOLO';
    this.nRec = 0;
    this.parentEmbedded.postMessage(
      {
        cmd: 'prms',
        payload:
          'functionName=GetFascicolo;companyId=2;name=F0002200;majorRelease=1;minorRelease=0;',
      },
      '*'
    );
  }

  callMsitbs() {
    this.texarea.nativeElement.value = '';
    this.calledPgm = 'MSITBS';
    this.nRec = 0;
    this.parentEmbedded.postMessage(
      {
        cmd: 'prms',
        payload:
          'functionName=GetConta;procavpName=MSITBS;companyId=6280;sDate=01/01/2021;eDate=31/12/2021;minorRelease=0;majorRelease=1;bType=O1',
      },
      '*'
    );
  }

  updateDitte() {
    this.texarea.nativeElement.value = '';
    this.inBackground = true;
    this.calledPgm = 'UPDATEDITTE';
    this.nRec = 0;
    this.parentEmbedded.postMessage(
      {
        cmd: 'prms',
        payload:
          'functionName=UpdateDitte;majorRelease=1;minorRelease=0;companyIdFrom=2;companyIdTo=2;',
      },
      '*'
    );
  }

  lookUpDitte() {
    this.texarea.nativeElement.value = '';
    this.calledPgm = 'LOOKUPDITTE';
    this.nRec = 0;
    this.parentEmbedded.postMessage(
      {
        cmd: 'prms',
        payload: 'functionName=GetDitte;majorRelease=1;minorRelease=0;',
      },
      '*'
    );
  }

  gesDitta() {
    debugger;
    this.texarea.nativeElement.value = '';
    this.calledPgm = 'ANADITTE';
    this.nRec = 0;
    this.parentEmbedded.postMessage(
      {
        cmd: 'prms',
        payload:
          'functionName=GesAnag;companyId=1031;majorRelease=1;minorRelease=0;',
      },
      '*'
    );
  }

  cambiofile() {}

  sendChunk() {
    this.nRec = 0;
    this.parentEmbedded.postMessage(
      { cmd: 'testGet', payload: this.texarea.nativeElement.value },
      '*'
    );
  }

  login() {
    this.parentEmbedded.postMessage(
      { cmd: 'login', payload: this.texarea.nativeElement.value },
      '*'
    );
  }

  sendCsv() {
    this.nSRChunk = 0;
    this.calledPgm = 'RECEIVECHUNK';
    this.parentEmbedded.postMessage(
      {
        cmd: 'prms',
        payload:
          'functionName=StartReceive;majorRelease=1;minorRelease=0;fileID=rettifiche;totFiles=1;prgFile=1;format=csv;totChunk=5;totRows=23;',
      },
      '*'
    );
  }

  putRettifiche() {
    this.calledPgm = 'PUTRETTIFICHE';
    this.parentEmbedded.postMessage(
      {
        cmd: 'prms',
        payload:
          'functionName=PutRettifiche;companyId=2014;majorRelease=1;minorRelease=0;sdate=01/01/2020;edate=31/12/2020;fileID=rettifiche;',
      },
      '*'
    );
  }
}
