# MS_Buergerbuero


## Kurzbeschreibung

- Zentraler Service innerhalb der Smart City
- Anlaufstelle für alle Bürger
- Bietet eine Nutzerverwaltung (Anmeldung, Ummeldung, Abmeldung)
- Bietet ein schwarzes Brett(digitale Pinnwand) um aktuelle Informationen darzustellen

## Use Cases:

- Unterteilen sich in vier Benutzergruppen
  - Interessent
    - Können sich registrieren
    - Aushänge ansehen
  - Bürger
    - Nutzerkonto verwalten
    - Aushang erstellen / Erstellten Aushang wieder löschen
    - Fundgegenstand abgeben / Fundgegenstand abholen
  - Mitarbeiter
    - Erstellten Aushang freigeben 
    - Aushang entfernen
      
  - Andere Dienstleister (Microservices)
    - Nutzerdaten anfragen
    - Nutzertoken verifizieren
    - Aushang abgeben
    - Aushang wieder entfernen
  - Admin
    - Mitarbeiter einstellen
    - Mitarbeiter kündigen
## Technologie:

- Node JS Backend Server (mit mehreren Komponenten)
  - Mali Framework für grpc
  - Nutzerverwaltung/Authentifizierung mit Google Firebase
  - Amqp Lib für RabbitMQ
- PostgreSQL Datenbank
  - Zugriff auf die Datenbank mit Hilfe von TypeORM
- Angular Webanwendung

## Schnittstellen

- Gibt Userdaten raus (Benötigt UserID)
- Nimmt Anhänge fürs schwarze Brett entgegen
- Verifiziert User Token und gibt userid zurück
- Löscht Anhänge vom schwarzen Brett

## Ereignisse (Message Queues)

- Bürgerdaten haben sich geändert
- Bürger ist zugezogen (Neue Registrierung)
- Nutzerkonto wurde deaktiviert (weggezogen oder für tot erklärt)

## Testdaten

#### Mitarbeiter

```
E-Mail: mitarbeiter@buergerbuero.de
Passwort: 123456
```

#### Admin

```
E-Mail: admin@buergerbuero.de
Passwort: 123456
```

