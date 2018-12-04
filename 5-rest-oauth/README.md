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