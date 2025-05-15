# Skoda prémium használtautó kereskedés
A beüzemelés és az elindítás ugyanúgy működik, mint ahogyan gyakorlaton is csináltuk. A mongo adatbázis konténerizált, az otthoni fejlesztés során MongoDB Community-t használtam.
A szerver első indításánál, miután fut a MongoDB állomány futtani kell a következő paracsot, hogy az adatbázisba betöltsük a demo adatokat: **npm run init_db**


### Docker konténer:
	# BUILD: sudo docker build -t my_mongo_image .
    # RUN: sudo docker run -p 6000:27017 -it --name my_mongo_container my_mongo_image

### Angular kliens:
	npm install
	ng serve

### NodeJS szerver:
	npm install
	npm run build
	npm run start

### Megjegyzések:
- A tesztvezetés, időpontok és hírdetések objektumok, amelyek a felhasználókhoz kötöttek, edge case-ben képesek inkonzisztenciát  okozni, amennyiben az egyiket töröljük. Tegyük fel, hogy van egy felhasználónk, aki egy adott hírdetésre foglalt időpontot. Amennyiben admin felhasználóként törlünk egy hírdetést, nem fog törlődni a hozzá tartozó időpont/tesztvezetés.
- Az adatbázisban 4 modell található: felhasználó, autós hírdetés, tesztvezetés, egyéb időpont
- a repóban található egy videó is "intro_video" névvel
- a projekt saját téma, ezért mellékelve van a .docx is fájl is("PRF-Skoda-updated.docx")
- az "init" mappában találhatóak a JSON fájlok, amelyek tartalmazzák a demó adatokat.
- admin felhasználónév és jelszó: **admin@gmail.com, adminPW**
- egyéb felhasználók bejelentkezési adatai: **teszt.elek@gmail.com, Elek1234**, **hard.vera@gmail.com, Vera1234**, **debu.geza@gmail.com, Geza1234**
