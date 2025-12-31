# Vježba 5 - MongoDB baza podataka


## Pokretanje aplikacije

Aplikacija se sastoji od **backend** i **frontend** dijela.

### Preduvjeti
- Instaliran **Node.js**
- Kreiran **MongoDB Atlas cluster**
- Povezivanje na bazu vrši se putem **varijabli okruženja**
- MongoDB connection string i naziv baze **ne verzioniraju se na GitHub**
---



### Backend

1. **Nakon lokalnog kloniranja repozitorija uđite u direktorij gdje se nalazi backend dio aplikacije**:     
   ```
   cd pizzaexpress 
   ```
2. **Kreirajte `.env` datoteku u backend direktoriju**:
   ```
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/
   MONGO_DB_NAME=pizza_db
   ```
    `pizza_db` je naziv baze podataka koja se koristi u aplikaciji.  
    Zamijenite `<username>`, `<password>` i `<cluster-url>` podacima vašeg MongoDB clustera.  
   Datoteka `.env` ne smije biti dodana u repozitorij.
3. **Instalirajte potrebne pakete**: 
   ```
   npm install
   ```
4. **Pokrenite backend poslužitelj**: 
   ```
   node index.js
   ```
5. **Nakon pokretanja, backend poslužitelj dostupan je na adresi**: 
   ```
   http://localhost:3000
   ```



### Frontend


1. **Nakon lokalnog kloniranja repozitorija uđite u direktorij gdje se nalazi frontend dio aplikacije**:
   ```      
   cd pizzavue
   ```
2. **Instalirajte potrebne pakete**:
   ```
   npm install
   ```
3. **Pokrenite frontend aplikaciju**:
   ```
   npm run dev
   ```
4. **Nakon pokretanja, frontend aplikacija dostupna je na adresi**:
   ```
   http://localhost:5173
   ```















