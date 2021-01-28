-- sql commands for the database setup

create table criminal (cid char(3),cname varchar(30) not null,alias 
varchar(25) unique,mo varchar(70),lastloc varchar(25),primary key(cid));

create table prison (pid char(3),pname varchar(25) unique,ploc varchar(25),primary key(pid));

create table rehab (rcid char(4),rcname varchar(35) unique,rloc varchar(20),primary key(rcid));	

create table wlist (wcode char(3),crime varchar(50),bounty bigint(10),primary key(wcode));	


create table cp (cid char(3),pid char(3),foreign key (cid) references criminal(cid),foreign key (pid) references prison(pid));

create table crc (cid char(3),rcid char(4),foreign key (cid) references criminal(cid),foreign key (rcid) references rehab(rcid));

create table cw (cid char(3),wcode char(3),foreign key (cid) references criminal(cid),foreign key (wcode) references wlist(wcode));


create table p_ph (ptel bigint(10),pid char(3),FOREIGN KEY (pid) REFERENCES prison(pid));

create table rcph (rcid char(4),rctel bigint(10),FOREIGN KEY (rcid) REFERENCES rehab(rcid));





create table dcriminal (cid char(3),cname varchar(30) not null,alias 
varchar(25) unique,mo varchar(70),lastloc varchar(25),primary key(cid));

create table dcp (cid char(3),pid char(3),foreign key (cid) references dcriminal(cid));

create table dcrc (cid char(3),rcid char(4),foreign key (cid) references dcriminal(cid));

create table dcw (cid char(3),wcode char(3),foreign key (cid) references dcriminal(cid));



CREATE TABLE IF NOT EXISTS `agents_login` (`id` int(11) NOT NULL,`username` varchar(50) NOT NULL UNIQUE,`password` varchar(255) NOT NULL,`name` varchar(50) NOT NULL,primary key(id)) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

INSERT INTO `agents_login` (`id`, `username`, `password`, `name`) VALUES (1, 'admin', 'password890', 'zeus@fbic');

ALTER TABLE `agents_login` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;


-- insertion into tables


insert into criminal values
("c01","Michael Myers","electron","Assault","Califonia"),
("c02","Jason Voorhees","JV","Assault and robbery","Arizona"),
("c03","Emperor Palpetine","king","Abduction","Florida"),
("c04","Arthur Fleck","Mr. Glass","Computer Hacking","london,UK"),
("c05","Lex Luthor","Lex","Bank robbery","seattle"),
("c06","Count Orlok","Bob","Bribing","north virginia"),
("c07","Jack Torrance","Jack","Burglary","washington"),
("c08","Heinz Doofenschmirtz","Heinz","Credit card Hacking","Russia"),
("c09","Tony Soprano","Tony","Escaping Federal Custody","Nevada"),
("c10","Michael Corleone","Corleone","Terrorist","ohio"),
("c11","Keyzer Soze","Keyzy","Explosives","afghanistan"),
("c12","Anakin Skywalker","Skywalker","Multiple Murders","florida"),
("c13","Hans Gruber","hans","Shooting","ohio"),
("c14","Freddy Krueger","Freddy","Drugs dealer","New Mexico"),
("c15","Hannibal Lecter","Lecter","Smuggling","califonia"),
("c16","Anton Chigurh ","Anton","Human Trafficking","Arizona"),
("c17","Tom Riddle","Tom","Adultery","texas"),
("c18","Marsellus Wallace","Wallace","Assaulting police officer","hawaii"),
("c19","Jarlab Hsuna","Jerry","Bank robbery","Colorado"),
("c20","Ivan Drago","Drago","Illegal Business","Illinois");



insert into prison values
("p01","Bay Max Prison","Scotland"),
("p02"," Bang Kwang Prison","Bangkok"),
("p03","The Dark prison","Boston"),
("p04","Petak Island Prison","Vologda,Russia"),
("p05","Sabaneta Prison","Venezuela"),
("p06","Rikers Island ","new york"),
("p07","Diyarbakir Prison ","Turkey"),
("p08"," Tadmor Prison","Syria"),
("p09","Camp 22","North Korea"),
("p10","EL Rodeo","Venezuela");

insert into rehab values
("rc01","Passages Malibu","US"),
("rc02","The Priory Group","UK"),
("rc03","Crossroads Centre","Antigua"),
("rc04","The Sanctuary Byron Bay","Australia"),
("rc05","Betty Ford Center","US"),
("rc06","PROMIS Rehabilitation Clinic","UK"),
("rc07","The Meadows","US"),
("rc08","Serenity House","Spain"),
("rc09","Sober Living by the Sea","Califonia,US"),
("rc10","Sapiens Well-Being","India");

insert into wlist values
("w01","Trafficking of children",100000),
("w02","food adulteration",10000),
("w03","murdering 2 employees",60000),
("w04","bank theft",200000),
("w05","Black money",120000);

insert into p_ph values
(9909888123,"p01"),
(9909090123,"p02"),
(9099123419,"p03"),
(9019090980,"p04"),
(9090545670,"p05"),
(9898435670,"p06"),
(9898402000,"p07"),
(9898400211,"p08"),
(9898400727,"p09"),
(9898400098,"p10"),
(9898402001,"p07");

insert into rcph values
("rc01",9876929565),
("rc02",9115619583),
("rc03",9153653901),
("rc04",9800875333),
("rc05",9702080493),
("rc06",9242494153),
("rc07",9101550271),
("rc08",9448328662),
("rc09",9446626322),
("rc10",9806583592);


insert into cp values
("c01","p01"),
("c02","p02"),
("c03","p03"),
("c04","p04"),
("c05","p05"),
("c06","p06"),
("c07","p07"),
("c08","p08"),
("c09","p09"),
("c10","p10");

insert into crc values
("c11","rc01"),
("c12","rc03"),
("c13","rc04"),
("c14","rc09"),
("c15","rc07");

insert into cw values
("c16","w01"),
("c17","w03"),
("c18","w04"),
("c19","w02"),
("c20","w05");


-- trigger for phone number checking

delimiter $$
CREATE TRIGGER t1
 BEFORE INSERT 
 ON p_ph FOR EACH ROW 
BEGIN
   DECLARE numLength INT;
   -- DECLARE message_text CHAR;
   SET numLength = (SELECT CHAR_LENGTH(NEW.ptel));
   IF (numLength < 10 or numLength > 10) THEN
     signal sqlstate '45000'; -- 45000 = “unhandled user-defined exception.” 
     /*--or some thing else **/
     -- set message_text = "invalid phone number!" 
   END IF ;
END $$

CREATE TRIGGER t_rcph
 BEFORE INSERT 
 ON rcph FOR EACH ROW 
BEGIN
   DECLARE numLength INT;
   -- DECLARE message_text CHAR;
   SET numLength = (SELECT CHAR_LENGTH(NEW.rctel));
   IF (numLength < 10 or numLength > 10) THEN
     signal sqlstate '45000'; /*--or some thing else **/
     -- set message_text = "invalid phone number!" 
   END IF ;
END $$

delimiter ;