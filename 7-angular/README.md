# Angular 2+

Ustvarite spletno stran (Single page application ali SPA) za novice v tehnologiji Angular. Pri tej nalogi boste spoznali tehnologije: components, directives, routes, nested routes, services, pipes, reactive forms, form validation, can activate guard, can deactivate guard, http interceptor in rxjs.

Novice, ki so brezplačne lahko berejo vsi. Plačljive novice lahko berejo samo prijavljeni uporabniki. Če je novica plačljiva, potem neprijavljen uporabnik vidi samo naslov in datum, brez besedila. Novice lahko vstavlja samo uporabnik z vlogo admin.

Vsa komunikacija s strežnikom poteka preko storitev, kjer uporabite storitve ali REST ali GraphQL. Za prijavo uporabite OAuth 2.0. Za potrebe te naloge, dopolnite kodo iz prešnje vaje.

Za primer glejte priložen projekt [novice.zip](novice.zip), ki je sicer implementiran brez komunikacije s storitvami (REST/GraphQL). Geslo za prijavo je _test_.

---
## Priprava projekta:

Najprej ustvarite [nov Angular projekt](https://angular.io/cli/new). Pri ustvarjanju projekta ne pozabiti na zastavici `--routing`, lahko pa uporabite tudi `--skipTests`.

Primer ukaza:
```bash
ng new novice --routing --skipTests
```
Za lepši izgled strani uporabite Boostrap. Najprej poženite:
```bash
npm install bootstrap jquery
npm install --save-dev @types/jquery @types/bootstrap
```
V angular.json dopolnite styles:
```json
"styles": [
    "node_modules/bootstrap/dist/css/bootstrap.min.css",
    "src/styles.css"
]
```
V kodi, kjer želite uporabiti javascript funkcionalnost Bootstrap-a, dodajte:
```typescript
import * as $ from 'jquery';
import 'bootstrap';
```

---
## Struktura spletne strani

Na začetni poti '/' naj bo začetna stran (npr. `HomeComponent`), kjer izpišete pozdrav. Stran ustvarite z: 
```bash
ng generate component Home --spec=false
```
Na poti 'novice' se nahaja seznam novic s poljem za iskanje in vgnezdeno potjo 'avtor', kjer boste izpisali novice izbranega avtorja.

Na poti 'novice/vstavi' je obrazec za vstavljanje novice. To pot zaščitite z guard, tako da uporabnik, ki nima vloge admin, ne more na stran (`canActivate`) in uporabnik, ki vsaj delno izpolni obrazec, ne more navigirati strani (`canDeactivate`).

Na poti '404' naj bo izpisano, da stran ne obstaja. Stran ustvarite z: 
```bash
ng generate component NotFound --spec=false
```
Vse ostale nedefinirane poti preusmerite na pot '/404'.

---
## Storitev prijave

Za potrebe prijave ustvaritev storitev Angular (angl. Angular Service). Uporabite ukaz: 
```bash
ng generate service Auth --flat=true --spec=false
```
Storitev ima metodi `singIn` in `signOut`. Storitev ima tudi javne lastnosti: `token, username, polnoIme, vloga` in `timeToEnd$ = new Subject()`;

Lastnost `timeToEnd$` naj vsako sekundo odda čas do konca odjave, dokler ne doseže 0.

---
## Storitev novic


Storitev novic ustvarite z ukazom: 
```bash
ng generate service seznam-novic/novice --flat=true --spec=false
```
Storitev naj implementira metode za pridobivanje, iskanje in vstavljanje novic. Uporabite `HttpClient`, ki ga uvozite z:
```typescript
import { HttpClient } from '@angular/common/http';
constructor(private http: HttpClient) { }
```
Dopolnite tudi app.module.ts s `HttpClientModule`.

Pri klicu na REST/GraphQL strežnik ne nastavite žetona (angl. _token_). To boste naredili kasneje s prestreznikom (angl. _interceptor_). Metode za pridobivanje, iskanje in vstavljanje novic naj vračajo `Promise`.

Model za novico:

```typescript
export class Novica {
    public avtor:string;
    public naslov:string;
    public placljiva:boolean;
    public datum:Date;
    public besede:string[];
    public besedilo:string;
}
```

---
## Navigacija

Navigacija naj bo v glavi. Ustvarite komponento z ukazom: 
```bash
ng generate component Navigacija --spec=false
```
Komponento uporabite v app.component.html nad značko `router-outlet`.

Komponenta naj vsebuje tudi pripravljeni modalni okni, prvo naj obvešča, da mora imeti uporabnik vlogo admin, drugo pa prijavni obrazec. Pomagajte si z bootstrap-modal.

Če oba polja, uporabniško ime in geslo, nista izpolnjena, naj bo gumb za prijavo onemogočen. Uporabite direktivo `[disabled]="!loginForm.valid"` in za polji nastavite, da sta obvezni z `new FormControl(null, [Validators.required])`.

Komponenta naj ima povezave na Domov, Novice, Vstavi novico in gumb za Prijavo.

Po prijavi se naj gumb za prijavo skrije, prikazati se pa mora uporabniško ime z odštevanjem časa do odjave. Ob kliku na uporabniško ime se prikaže spustni meni z odjavo, tako da se lahko uporabnik odjavi pred potekom časa. Za meni uporabite razrede Bootstrap: `dropdown, dropdown-toggle in dropdown-menu`. Element div z razredom dropdown naj ima tudi atribut appDropdown, ki predstavlja direktivo. Implementacija je priložena v dropdown.directive.ts. Ne pozabiti dopolniti app.module.ts, kar se naredi avtomatsko, če direktivo ustvarite z: 
```bash
ng generate directive shared/dropdown --spec=false
```
Namig:
Časovnik lahko implementirate s knjižnico rxjs:
```typescript
let time = 10
interval(1000).pipe(
    take(time),
    map(t => time-1-t)
).subscribe(t => {
    this.timeToEnd$.next(t)
    if (t == 0) {
        this.signOut()
    }
})
```

Pri odjavi uporabnika ne pozabite poklicati `unsubscribe`.

---
## Seznam novic

Seznam novic se nahaja na naslovu '/novice'. Vsebuje vnosno polje za iskanje in seznam novic. Prikaz pozamezne novice naj bo svoja komponenta. Za novico prikažite naslov, avtorja, datum, ključne besede in besedilo. Komponenti za seznam in posamezno novico ustvarite z:

```bash
ng generate component SeznamNovic --spec=false
ng generate component seznam-novic/Novica --spec=false
```
Za prikaz večih novic uporabite direktivo `*ngFor`. Komponenta za prikazano novico naj ima tudi novico kot vhodni atribut.

Primer:

```html
<app-novica *ngFor="let novica of (novice | async)" [novica]="novica"></app-novica>
```
Če ni nobenih novic se mora izpisati "Ni zadetkov".

Primer:
```html
<div *ngIf="(novice | async)?.length==0">Ni zadetkov :(</div>
```
Datum in uro novice izpišite v formatu `date:"medium"`, za kar uporabite pipo.

Če uporabnik v vnosno polje vpiše iskalni niz, se spremeni URL, kjer se doda query parameter q, ki predstavlja iskalni niz. To se zgodi šele 0,5 sekund po prenehanju tipkanja in če, glede na prejšnji iskalni niz, ni prišlo do sprememb.

Primer:
```typescript
this.filterInput.valueChanges.pipe(
    debounceTime(500),
    distinctUntilChanged()
)
.subscribe(filter => this.router.navigate([], {queryParams:{q:filter}, queryParamsHandling:"merge"}));
```
Iskanje se izvede glede na spremembo URL-ja in tudi če gremo na stran ter natipkamo parameter q npr. `"novice?q=odkrili"`.

Za poslušanje URL-ja se morate registrirati:
```typescript
this.route.queryParamMap.pipe(
     map((paramMap:ParamMap) => paramMap.has("q") ? paramMap.get("q") : ''),
     distinctUntilChanged()
).subscribe(filter => {...
});
```
Besedila plačljivih novic so vidna samo prijavljenim uporabnikom:
```html
<div *ngIf="(authService.mytoken!='' || !novica.placljiva); else prijaviSe">{{novica.besedilo}}</div>
```
V nasprotnem primeru se mora izpisati "Prijavi se za vsebino". Ko prijava poteče, se besedila plačljivih novic avtomatsko skrijejo. Ob kliku na avtorja novice se naj na dnu strani pojavi seznam naslovov in datumov vseh novic izbranega avtorja. Za to uporabite nested route. Ustvarite komponento: 
```bash
ng generate component seznam-novic/NoviceAvtorja --spec=false
```
Komponenta naj posluša za spremembo URL-ja, od koder naj prebere query parameter avtorja. Vse naslove in datume novic nato prikažete z `ngFor`. Datume pretvorite s pipo (angl. _pipe_) v format `date:"short"`.

Na konec datoteke seznam-novic.component.html je za vgnezden route potrebno dodati tudi:
```html
<router-outlet></router-outlet>
```

---
## Vstavljanje novic

Obrazec za vstavljanje novic se nahaja na naslovu '/novice/vstavi'. Komponento ustvarite z: 
```bash
ng generate component VstaviNovico --spec=false
```
Uporabite [Reactive Forms](https://angular.io/guide/reactive-forms) in ne Template-driven Forms. V app.module.ts dodajte `ReactiveFormsModule`.

Obrazec oblikujte z Bootstrap.

Značko form označite s `[formGroup]="novicaForm"`, ki jo v kodi definirate kot lastnost `novicaForm: FormGroup`;

Ob inicializaciji komponente morate inicializirati lastnost novicaForm, kjer podate strukturo, ki naj bo enaka modelu novice. Tu še določite validacijo. Naslov naj bo obvezen in naj ima maksimalno 100 znakov. Besedilo naj bo obvezno. Besede naj predstavljajo `FormArray`.

Uporabnik lahko dinamično doda polje za ključno besedo. Pomagajte si z naslednjo implementacijo:
```typescript
dodajKljucnoBesedo() {
    (<FormArray>this.novicaForm.get('besede')).push(new FormControl('', [Validators.required, Validators.maxLength(30)]))
}
```
Če obrazec ni veljaven mora biti gumb za shranjevanje onemogočen:
`[disabled]="!novicaForm.valid"`

Če uporabniku prijava poteče, se naj ob kliku na gumb shrani prikaže modalno okno z obvestilom, da mora imeti vlogo admin.

Obvestilo, da gre za neveljaven vnos, naj bo vidno šele, ko se uporabnik polja dotakne, čeprav je polje, ki je obvezno, neveljavno že na začetku.

Primer izpisa napake:
```html
<div *ngIf="novicaForm.get('naslov').invalid && (novicaForm.get('naslov').dirty || novicaForm.get('naslov').touched)" class="alert alert-danger">
     <div *ngIf="novicaForm.get('naslov').errors['maxlength']">
         Predolgi naslov.
     </div>
     <div *ngIf="novicaForm.get('naslov').errors['required']">
         Naslov je zahtevan.
     </div>
</div>
```
Za oblikovanje veljavnih/neveljavnih vnosnih polj v styles.css dodajte:

```css
input.ng-invalid.ng-touched, textarea.ng-invalid.ng-touched {
     border-left: 5px solid red;
}

input.ng-valid, textarea.ng-valid {
     border-left: 5px solid green;
}
```
V dokumentaciji si poglejte pomen razredov `ng-invalid, ng-touched, ...`

Če uporabnik ni prijavljen z vlogo admin, navigiranje na naslov '/novice/vstavi' ni dovoljeno. Prikazati morate modalno okno, ki uporabnika obvesti, da mora imeti vlogo admin. Za to uporabite guard.

Ustvarite guard z ukazom: 
```bash
ng generate guard Auth --flat=true --spec=false
```
V guard implementirajte metodo canActivate, kjer preverite vlogo prijavljenega uporabnika. Za to morate "injectati" storitev za prijavo `AuthService`. Če uporabnik nima prave vloge, prikažite ustrezno modalno okno. Datoteko app-routing.module.ts morate tudi ustrezno dopolniti z `canActivate:[AuthGuard]`.

Če uporabnik delno izpolni obrazec za novico ga morate opomniti, če želi zapustiti stran, da bo izgubil podatke. Če se uporabnik strinja, šele takrat lahko zapustite stran. Za to uporabite CanDeactivate Guard.

Namig:
>Kopirajte priloženo datoteko can-deactivate-guard.ts. Datoteko app-routing.module.ts morate tudi ustrezno dopolniti z canDeactivate: [CanDeactivateGuard].

V komponenti za vstavljanje novice nato implementirate vmesnik `CanComponentDeactivate`, kjer preverite, če je uporabnik kaj izpolnil:

```typescript
canDeactivate() : boolean | Observable<boolean> | Promise<boolean> {
    if (this.novicaForm.value.naslov == ''
        && this.novicaForm.value.placljiva==false
       && this.novicaForm.value.besedilo == ''
       && this.novicaForm.value.besede.length == 0 ) {
       return true;
    } else if (this.shranjeno) {
       return true;
    } else {
       return confirm("Želite zavržti nedokončan obrazec?");
    }
}
```

---
## Interceptor za avtentikacijo

Pri tej točki boste naredili itreceptor, kjer boste prestregli zahteve AJAX HTTP poslane s `HttpClient` in jih dopolnili z avtorizacijskim zaglavjem (angl. _header_). Če ste avtorizacijsko zaglavje dodali kje drugje, jo tam odstranite.

Interceptor ustvarite z ukazom: 
```bash
ng generate service shared/TokenInterceptor --flat=true --spec=false
```
Interceptor, naj prestreže zahtevo, jo klonira in nato doda avtorizacijsko zaglavje z žetonom. Novo zahtevo naj nato pošlje dalje. Zaglavje ni treba vedno dodati, npr. pri prijavi, zato lahko tudi preverite, na kateri naslov se zahteva pošilja.