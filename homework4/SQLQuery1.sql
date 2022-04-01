CREATE DATABASE FuelApplication;
use FuelApplication;

CREATE TABLE UserCredentials(
UserID int IDENTITY(1,1) ,
UserLogin varChar(255) NOT NULL ,
Password varChar(255) NOT NULL
)

CREATE TABLE ClientInformation(
FullName VarChar(255) NOT NULL,
Address1 VarChar(255) NOT NULL,
Address2 VarChar(255),
City VarChar(255) NOT NULL,
State VarChar(255) NOT NULL,
ZipCode int NOT NULL,
UserID int FOREIGN KEY REFERENCES UserCredentials(UserID),
)

CREATE TABLE FuelQuote(
Gallons int NOT NULL,
DeliveryAddress varChar(255) NOT NULL,
DelliveryDate date NOT NULL,
SuggestedPrice int NOT NULL,
Total int NOT NULL,
UserID int FOREIGN KEY REFERENCES UserCredentials(UserID),
)




INSERT INTO ClientInformation VALUES ('Morgan Freeman', '1234 Some Street', NULL, 'Los Angeles', 'California', '12345') 
INSERT INTO ClientInformation VALUES ('Freddy Jason', '1234 Some Street', NULL, 'Austin', 'Texas', '11111') 
INSERT INTO ClientInformation VALUES ('Katniss Everdeen', '1234 Some Street', NULL, 'San Franciso', 'California', '12345') 
INSERT INTO ClientInformation VALUES ('Ron Weasly', '1234 Some Street', NULL, 'Austin', 'Texas', '12345') 
INSERT INTO ClientInformation VALUES ('Preston Garvey', '1234 Some Street', NULL, 'Los Angeles', 'North Dakota', '11111') 


