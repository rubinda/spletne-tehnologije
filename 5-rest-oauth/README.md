# REST + OAuth 2.0

Ustvarite REST storitve za novice, ki jih zaščitite z OAuth 2.0.

## Podrobnejši opis

Novice, ki so brezplačne lahko berejo vsi. Plačljive novice lahko berejo samo prijavljeni uporabniki. Novice lahko vstavlja samo admin (vloga).

Spletne strani (uporabniškega vmesnika) ni potrebno narediti. Delovanje storitev boste preizkusili s Postman-om.

Uporabnik lahko pri prijavi zahteva scope read in write. S Scope read lahko bere plačljive novice, s scope write pa lahko tudi piše komentarje za novice. Z vlogo admin lahko dodamo novice, in določimo uporabnikom scope. Vsak admin lahko ureja samo svoje novice.

Novice, ki so brezplačne se lahko berejo brez prijave.

Novica ima naslov, opis, čas vstavljanja in uporabnika, ki jo je vstavil. Novica mora imeti tudi podatek, da je plačljiva.

Uporabnik ima ime, priimek, starost in e-mail.

Vsa opisana funkcionalnost mora biti izvedljiva preko API-ja. Za bazo lahko uporabite **MongoDB**. Access token ponavadi hranimo v bazi, ki živi v pomnilniku. Refresh token mora biti trajno shranjen, saj je njegova veljavnost ponavadi več let, oz. do preklica. Pri tej vaji implementirajte način *password grant* in *refresh_token grant*. Več o ostalih načinih si lahko preberete na strani https://alexbilbie.com/guide-to-oauth-2-grants/.

API-ja za namen registracije uporabnikov ne rabite delati, zato v bazo ročno shranite nekaj navadnih uporabnikov in takih z vlogo admin.

Za začetek, najprej preizkusite priloženo aplikacijo [vaja5RESTOAuth2.zip](vaja5RESTOAuth2.zip).

## Screenshot rešitve

Za zastonjske novice lahko obiščete `/api/news`, za komentiranje, ogled plačljivih novic pa lahko uporabite Postmana (glej primere znotraj vaja5REST0Auth2.zip). 

Za pridobitev tokena, si ustvarite uporanbika v MongoDB in lahko klicete
```bash
curl -X POST \
  http://localhost:3000/oauth/token \
  -H 'Authorization: Basic Tm9kZU5ld3M6YW55dGhpbmc=' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -H 'Postman-Token: 879d8e8d-86d8-4b12-882b-0f53114a6ca7' \
  -H 'cache-control: no-cache' \
  -d 'grant_type=password&username=rubind&password=MalaSrna2&scope=read%20write&undefined='
```

![solution](./solution.png)