CREATE DATABASE Tessera;
GO
USE Tessera;
GO

CREATE TABLE Employees(
	Id VARCHAR(8) PRIMARY KEY,
	FirstName VARCHAR(50) NOT NULL,
	LastName VARCHAR(100),
	Email VARCHAR(255) NOT NULL CHECK (Email LIKE ('%@%')),
	PhoneNumber VARCHAR(20) NOT NULL,
	BirthDate DATE NOT NULL,
	HireDate DATETIME NOT NULL,
	JobTitle VARCHAR(50) NOT NULL,
	ReportsTo VARCHAR(8)REFERENCES Employees(Id),
	DeletedDate DATETIME
);

CREATE TABLE Users(
	Id VARCHAR(8) PRIMARY KEY REFERENCES Employees(Id),
	Username VARCHAR(100) UNIQUE NOT NULL,
	Password VARCHAR(255) NOT NULL,
	Role VARCHAR(50) CHECK(Role IN ('Admin', 'TechSupport', 'Manager')) NOT NULL
);

CREATE TABLE Appeals(
	Id INT IDENTITY(1,1) PRIMARY KEY,
	Subject VARCHAR(100) NOT NULL,
	Description VARCHAR(1000) NOT NULL,
	Email VARCHAR(255) NOT NULL CHECK (Email LIKE ('%@%'))
);
CREATE TABLE Tickets(
	Id VARCHAR(15) PRIMARY KEY,								--Max : SRQ/YYYY/NNNNNN
	Title VARCHAR(100) NOT NULL,
	Details VARCHAR(1000) NOT NULL,
	CreatedDate DATETIME DEFAULT GETDATE() NOT NULL,
	DueDate DATETIME NOT NULL,
	Urgency VARCHAR(20) CHECK(Urgency IN ('High','Medium','Low')) NOT NULL,
	WorkStatus VARCHAR(20) CHECK(WorkStatus IN ('InProgress','Completed', 'Cancelled'))
		DEFAULT 'InProgress' NOT NULL,
	CreatedBy VARCHAR(8) REFERENCES Employees(Id) NOT NULL,
	AppointedTo VARCHAR(8) REFERENCES Employees(Id) NOT NULL,
	AppealId INT REFERENCES Appeals NOT NULL

);
CREATE TABLE TicketSolutions(
	Id VARCHAR(15) PRIMARY KEY REFERENCES Tickets(Id),
	Details VARCHAR(1000) NOT NULL,
	CompletedDate DATETIME DEFAULT GETDATE() NOT NULL,
	CompletionStatus VARCHAR(20) CHECK(CompletionStatus IN ('OnTime', 'Overdue', 'Cancelled')) NOT NULL,
	SupervisorReviewDate DATETIME,
	Supervisor VARCHAR(8) REFERENCES Employees(Id) NOT NULL
);

INSERT INTO Employees VALUES
('01010100', 'Master',	null, 'Master@any.id',	'080808080808',	'2000-01-01',	'2001-01-01',	'Admin', null, null);

INSERT INTO Users VALUES
('01010100', 'Master' ,'$2a$11$ZV7ZRuerzzXmXGAPl2xOpeUNuddwzRrGG2.S8WXdp7P1D4LpMQJCK', 'Admin');