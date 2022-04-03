DROP TABLE IF EXISTS ClientInformation;

DROP TABLE IF EXISTS FuelQuote;

DROP TABLE IF EXISTS UserCredentials;

CREATE TABLE UserCredentials(
UserID int IDENTITY(1,1) ,
UserLogin varChar(255) NOT NULL ,
UserPassword varChar(255) NOT NULL,
PRIMARY KEY (UserID)
)

CREATE TABLE ClientInformation(
FullName varChar(255) NOT NULL,
Address1 varChar(255) NOT NULL,
Address2 varChar(255),
City varChar(255) NOT NULL,
StateID varChar(255) NOT NULL,
ZipCode int NOT NULL,
UserID int FOREIGN KEY REFERENCES UserCredentials(UserID),
)

CREATE TABLE FuelQuote(
Gallons int NOT NULL,
DeliveryAddress varChar(255) NOT NULL,
DeliveryDate date NOT NULL,
SuggestedPrice float NOT NULL,
Total float NOT NULL,
UserID int FOREIGN KEY REFERENCES UserCredentials(UserID),
)
