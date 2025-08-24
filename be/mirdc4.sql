-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 25, 2024 at 03:54 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mirdc4`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `admin_aldp_approved` (IN `id` INT, IN `status` VARCHAR(50))   BEGIN

UPDATE aldp_proposed
SET aldpStatus = status
WHERE apID = id;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `admin_aldp_createALDPYear` (IN `ALDPYear` YEAR)   BEGIN

INSERT INTO aldp (
    aldp_year
)
SELECT ALDPYear
WHERE NOT EXISTS (
    SELECT aldp_year
    FROM aldp
    WHERE aldp_year = ALDPYear
) LIMIT 1;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `admin_aldp_getAll` (IN `pageNo` INT, IN `pageSize` INT, IN `keyword` VARCHAR(50))   BEGIN

SET pageNo = (pageNo-1)*pageSize;

SELECT a.apID,
       a.tpID, 
       a.competency, 
       a.description, 
       a.type, 
       a.classification, 
       a.noOfProgram, 
       a.perSession, 
       a.totalPax,
       a.estimatedCost, 
       a.divisions, 
       a.tentative_schedules, 
       a.createdOn, 
       a.updatedOn, 
       a.aldpStatus,
       pp.programName as program,
       tp.providerName as provider
FROM aldp_proposed AS a
LEFT JOIN trainingprovider_program AS tp_p ON a.tpID = tp_p.tpID
LEFT JOIN providerprogram AS pp ON tp_p.pprogID = pp.pprogID
LEFT JOIN availability AS av ON a.tpID = av.provID AND tp_p.pprogID = av.pprogID
LEFT JOIN trainingProvider AS tp ON tp_p.provID = tp.provID
WHERE competency LIKE (SELECT CONCAT('%',keyword,'%'))
AND aldpStatus = 'For Approval'
ORDER BY createdOn DESC
LIMIT pageSize OFFSET pageNo;

SELECT COUNT(apID) AS "total"
FROM aldp_proposed
WHERE competency LIKE (SELECT CONCAT('%',keyword,'%'))
AND aldpStatus = 'For Approval';

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `admin_aldp_getAllALDPYear` (IN `pageNo` INT, IN `pageSize` INT, IN `keyword` VARCHAR(4))   BEGIN

SET pageNo = (pageNo-1)*pageSize;

SELECT * FROM aldp
WHERE aldp_year LIKE (SELECT CONCAT('%',keyword,'%'))
ORDER BY aldp_year DESC
LIMIT pageSize OFFSET pageNo;

SELECT COUNT(aldpYearID) AS "total"
FROM aldp
WHERE aldp_year LIKE (SELECT CONCAT('%',keyword,'%'));

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `admin_aldp_getAllApproved` (IN `pageNo` INT, IN `pageSize` INT, IN `keyword` VARCHAR(50))   BEGIN

SET pageNo = (pageNo-1)*pageSize;

SELECT * FROM aldp_proposed
WHERE competency LIKE (SELECT CONCAT('%',keyword,'%'))
AND aldpStatus = 'Approved'
ORDER BY createdOn DESC
LIMIT pageSize OFFSET pageNo;

SELECT COUNT(apID) AS "total"
FROM aldp_proposed
WHERE competency LIKE (SELECT CONCAT('%',keyword,'%'))
AND aldpStatus = 'Approved';

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `admin_aldp_program_getAllAttendeesPerProgram` (IN `progID` INT)   BEGIN

SELECT ap.competency, ap.tpID, ap.description, 
ap.type, ap.classification, ap.noOfProgram,
ap.perSession, ap.totalPax, ap.tentative_schedules, pp.programName as program,
tp.providerName as provider
FROM aldp_proposed as ap
LEFT JOIN trainingprovider_program AS tp_p ON ap.tpID = tp_p.tpID
LEFT JOIN providerprogram AS pp ON tp_p.pprogID = pp.pprogID
LEFT JOIN availability AS av ON ap.tpID = av.provID AND tp_p.pprogID = av.pprogID
LEFT JOIN trainingProvider AS tp ON tp_p.provID = tp.provID
WHERE ap.apID = progID;

SELECT dbC.ID, dbC.competency, dbC.specificLearning, dbD.lastName,
dbD.firstName, dbD.middleName, dbC.priority, dbE.divisionName
FROM mirdc2.aldp_proposed AS dbA
LEFT JOIN mirdc2.aldpproposed_competency AS dbB
ON dbA.apID = dbB.apID
LEFT JOIN cmis.competency AS dbC
ON dbB.ID = dbC.ID
LEFT JOIN employees.employee as dbD
ON dbC.empID = dbD.empID
LEFT JOIN employees.division as dbE
ON dbD.divID = dbE.divID
WHERE dbA.apID = progID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `admin_aldp_program_getAllProgramDD` ()   BEGIN

SELECT pprogID, programName
FROM providerprogram
WHERE status='Available';

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `admin_aldp_program_updateProgramDetails` (IN `progID` INT, IN `q_pprogID` INT, IN `q_provID` INT, IN `aType` ENUM('Internal','External'), IN `classific` ENUM('Technical','Non-Technical'), IN `noProgram` INT, IN `perSesh` INT, IN `totalNoPax` INT, IN `estCost` FLOAT, IN `divi` VARCHAR(255), IN `tdate` DATE)   BEGIN
DECLARE tpID_val INT;
SELECT tpID INTO tpID_val from trainingprovider_program WHERE provID = q_provID AND pprogID = q_pprogID ;

UPDATE aldp_proposed
SET aldp_proposed.tpID = tpID_val, aldp_proposed.type = aType, aldp_proposed.classification = classific,
aldp_proposed.noOfProgram = noProgram, aldp_proposed.perSession = perSesh,
aldp_proposed.totalPax = totalNoPax, aldp_proposed.estimatedCost = estCost,
aldp_proposed.divisions = divi, 
aldp_proposed.tentative_schedules = tdate
WHERE aldp_proposed.apID = progID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `admin_aldp_proposed_add` (IN `compName` VARCHAR(100))   BEGIN

INSERT INTO aldp_proposed (competency)
SELECT compName
WHERE NOT EXISTS (SELECT competency FROM aldp_proposed
                  WHERE competency = compName) LIMIT 1;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `admin_aldp_proposed_create` (IN `competen` VARCHAR(100), IN `descrip` VARCHAR(255), IN `typ` ENUM('Internal','External'), IN `classif` ENUM('Technical','Non-Technical'), IN `noProgram` INT(3), IN `perSess` INT(3), IN `totalP` INT(3), IN `estimateCost` DECIMAL, IN `division` VARCHAR(100))   BEGIN

INSERT INTO aldp_proposed (
    competency, description, type, classification, noOfProgram, 
    perSession, totalPax, estimatedCost, divisions) 
   SELECT competen, descrip, typ, classif, noProgram, 
   perSess, totalP, estimateCost, division
WHERE NOT EXISTS(SELECT competency, description, type, classification, 
                 noOfProgram, perSession, totalPax, estimatedCost, 
                 divisions 
                 FROM aldp_proposed 
                 WHERE competency = competen) LIMIT 1;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `admin_aldp_proposed_dropdown` ()   BEGIN

SELECT apID, competency
FROM aldp_proposed
ORDER BY competency ASC;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `admin_aldp_submit` (IN `aID` INT, IN `cID` INT)   BEGIN

INSERT INTO aldpproposed_competency (
    apID, ID
)
VALUES (
    aID, cID
);

UPDATE competency_planned
SET compStatus = 'For ALDP'
WHERE pID = cID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `admin_aldp_updateALDPYearByID` (IN `ID` INT, IN `aldpyear` YEAR)   BEGIN

UPDATE aldp
SET aldp_year = aldpyear
WHERE aldpYearID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `admin_certificates_employees_getAllCertByEmpID` (IN `ID` INT)   BEGIN

SELECT * FROM certificates
WHERE empID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `admin_certificates_employees_getAllEmployees` (IN `pageNo` INT, IN `pageSize` INT)   BEGIN	

SET pageNo = (pageNo-1)*pageSize;

SELECT empID, position, employeeNo, lastName, firstName, gender,
employmentStat 
FROM employees ORDER BY employmentStat, lastname 
DESC 
LIMIT pageSize OFFSET pageNo;

SELECT COUNT(empID) AS "total" FROM employees;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `admin_certificate_approve` (IN `ID` INT)   BEGIN

UPDATE certificates
SET cert_status = 'Verified'
WHERE certID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `admin_certificate_getAllRequestForVerification` (IN `pageNo` INT, IN `pageSize` INT, IN `keyword` VARCHAR(100))   BEGIN

SET pageNo = (pageNo-1)*pageSize;

SELECT employees.empID, employees.lastname, 
employees.firstname, certificates.certID, 
certificates.programName, certificates.description,
certificates.trainingprovider, certificates.type, 
certificates.cert_status, certificates.createdOn
FROM certificates
LEFT JOIN employees
ON certificates.empID = employees.empID
WHERE certificates.cert_status = 'For Verification'
AND certificates.programName LIKE (SELECT CONCAT('%',keyword,'%'))
OR employees.lastname LIKE (SELECT CONCAT('%',keyword,'%'))
OR employees.firstname LIKE (SELECT CONCAT('%',keyword,'%'))
ORDER BY certificates.createdOn DESC
LIMIT pageSize OFFSET pageNo;

SELECT COUNT(certificates.certID) AS "total"
FROM certificates
LEFT JOIN employees
ON certificates.empID = employees.empID
WHERE certificates.cert_status = 'For Verification'
AND certificates.programName LIKE (SELECT CONCAT('%',keyword,'%'))
OR employees.lastname LIKE (SELECT CONCAT('%',keyword,'%'))
OR employees.firstname LIKE (SELECT CONCAT('%',keyword,'%'));

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `admin_certificate_getByID` (IN `ID` INT)   BEGIN

SELECT * FROM certificates
WHERE certID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `admin_certificate_reject` (IN `ID` INT)   BEGIN

UPDATE certificates
SET cert_status = 'Rejected'
WHERE certID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `admin_competency_getAllPendingRequestByDivID` (IN `ID` INT, IN `pageNo` INT, IN `pageSize` INT, IN `keyword` VARCHAR(50))   BEGIN 

SET pageNo = (pageNo-1)*pageSize;

SELECT specificLDNeeds, levelOfProficiency,
reqStatus, createdOn 
FROM competencyRequest
WHERE 
divID = ID AND 
specificLDNeeds LIKE (
    SELECT CONCAT(
        '%',keyword,'%'
    )) AND
    
reqStatus = 'For Division Chief Approval'
|| reqStatus = 'For L&D Approval'
ORDER BY reqStatus, createdOn DESC
LIMIT pageSize
OFFSET pageNo;

SELECT COUNT(*) 
FROM competencyRequest
WHERE divID = ID AND 
reqStatus = 'For Division Chief Approval' || reqStatus = 'For L&D Approval';

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `admin_competency_getAllRequestByCompetency` (IN `comptID` INT, IN `pageNo` INT, IN `pageSize` INT)   BEGIN

SET pageNo = (pageNo-1)*pageSize;

SELECT 
employees.lastname,
employees.firstname,
employees.middlename,
employees.gender,
employees.position,
competencyRequest.specificLDNeeds,
competencyRequest.levelOfProficiency
FROM compReq_Competencies
LEFT JOIN competencyRequest
ON compReq_Competencies.reqID = competencyRequest.reqID
LEFT JOIN employees
ON competencyRequest.empID = employees.empID
WHERE compReq_Competencies.compID = comptID
LIMIT pageSize OFFSET pageNo;

SELECT COUNT(compID) AS "total"
FROM compReq_Competencies
LEFT JOIN competencyRequest
ON compReq_Competencies.reqID = competencyRequest.reqID
LEFT JOIN employees
ON competencyRequest.empID = employees.empID
WHERE compReq_Competencies.compID = comptID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `admin_competency_planned_getAll` (IN `pageNo` INT, IN `pageSize` INT, IN `yr` VARCHAR(4))   BEGIN

SET pageNo = (pageNo-1)*pageSize;

SELECT db1.ID, db1.competency, db1.specificLearning, db4.targetDate, 
db2.lastName, db2.firstName, db2.middleName, db1.priority, db3.divisionName, 
db3.divisionChief, db4.createdOn, db4.compStatus
FROM cmis.competency AS db1
LEFT JOIN employees.employee AS db2
ON db1.empID = db2.empID
RIGHT JOIN employees.division AS db3
ON db2.divID = db3.divID
LEFT JOIN mirdc2.competency_planned as db4
ON db4.pID = db1.ID
WHERE (db4.compStatus = "For L&D Approval") AND YEAR(db4.createdOn) = yr
ORDER BY db4.createdOn DESC
LIMIT pageSize OFFSET pageNo;

SELECT COUNT(db1.ID) AS "total"
FROM cmis.competency AS db1
LEFT JOIN employees.employee AS db2
ON db1.empID = db2.empID
RIGHT JOIN employees.division AS db3
ON db2.divID = db3.divID
LEFT JOIN mirdc2.competency_planned as db4
ON db4.pID = db1.ID
WHERE (db4.compStatus = "For L&D Approval") AND YEAR(db4.createdOn) = yr;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `admin_competency_planned_getAllRequestCompetency` (IN `pageNo` INT, IN `pageSize` INT, IN `keyword` VARCHAR(50))   BEGIN

SET pageNo = (pageNo-1)*pageSize;

SELECT db4.compID, db1.ID, db1.competency, db1.specificLearning, 
db4.targetDate, db2.lastName, db2.firstName, 
db2.middleName, db3.divisionName, 
db3.divisionChief, db1.priority, db4.createdOn, 
db4.compStatus
FROM `mirdc2`.competency_planned as db4
LEFT JOIN `cmis`.`competency` AS db1
ON db4.`pID` = db1.`ID`
LEFT JOIN `employees`.`employee` AS db2
ON db1.`empID` = db2.`empID`
LEFT JOIN `employees`.`division` AS db3
ON db2.`divID` = db3.`divID`
WHERE db4.`compStatus` = "For L&D Approval" AND
db1.competency LIKE (SELECT CONCAT('%',keyword,'%'))
ORDER BY db4.`createdOn` DESC
LIMIT pageSize OFFSET pageNo;

SELECT COUNT(db4.compID) AS "total"
FROM `mirdc2`.competency_planned as db4
LEFT JOIN `cmis`.`competency` AS db1
ON db4.`pID` = db1.`ID`
LEFT JOIN `employees`.`employee` AS db2
ON db1.`empID` = db2.`empID`
LEFT JOIN `employees`.`division` AS db3
ON db2.`divID` = db3.`divID`
WHERE db4.`compStatus` = "For L&D Approval" AND
db1.competency LIKE (SELECT CONCAT('%',keyword,'%'));

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `admin_forms_addContentByFormID` (IN `id_val` INT, IN `type_val` VARCHAR(255), IN `label_val` VARCHAR(255), IN `required_val` VARCHAR(255), IN `correct_answer_val` VARCHAR(255))   BEGIN

INSERT INTO forms_content (formID, type, label, required, correct_answer) 
VALUES (id_val, type_val, label_val, required_val, correct_answer_val);


SELECT LAST_INSERT_ID() as content_id;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `admin_forms_addForm` (IN `apID_val` INT, IN `type_val` ENUM('Feedback for Facilitator','Feedback for Speaker','Feedback for Program','Pre and Post Test'))   BEGIN

INSERT INTO forms (apID, type) VALUES (apID_val, type_val);

SELECT LAST_INSERT_ID() as assigned_id;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `admin_forms_createFeedbackFacilitator` (IN `ID` INT, IN `eID` INT, IN `ans` ENUM('1','2','3','4','5'))   BEGIN

INSERT INTO forms_training_feedbackFacilitator_Answer (FBfacilitatorID, empID, answer)
SELECT (ID, eID, ans)
WHERE NOT EXISTS (
    SELECT FBfacilitatorID, empID, answer
    FROM forms_training_feedbackFacilitator_Answer
    WHERE FBfacilitatorID = ID
    AND empID = eID
)
LIMIT 1;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `admin_forms_createFeedbackSpeaker` (IN `fbID` INT, IN `emID` INT, IN `ans` ENUM('1','2','3','4','5'))   BEGIN

INSERT INTO forms_training_feedbackSpeaker_Answer (FBspeakerID, empID, answer)
SELECT (fbID, emID, ans)
WHERE NOT EXISTS (
    SELECT FBspeakerID, empID, answer
    FROM forms_training_feedbackSpeaker_Answer
    WHERE FBspeakerID = fbID
    AND empID = emID
)
LIMIT 1;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `admin_forms_createPrePostQuestion` (IN `ID` INT, IN `quest` VARCHAR(255), IN `ans` VARCHAR(255))   BEGIN

INSERT INTO forms_training_prePostAnswerKey (aldpID, question, answer)
SELECT (ID, quest, ans)
WHERE NOT EXISTS (
    SELECT aldpID, question, answer
    FROM forms_training_prePostAnswerKey
    WHERE aldpID = ID
    AND question = quest
    AND answer = ans
) 
LIMIT 1;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `admin_forms_createRegistration` (IN `ID` INT, IN `emID` INT, IN `cons` ENUM('Yes','No'), IN `typ` ENUM('Local','Foreign'), IN `class` ENUM('Technical','Non-Technical'))   BEGIN

INSERT INTO forms_registration (aldpID, empID, consent, type, classification)
SELECT (ID, emID, cons, typ, class)
WHERE NOT EXISTS(
    SELECT aldpID, empID, consent, type, classification
    FROM forms_registration
    WHERE aldpID = ID
    AND empID = emID
)
LIMIT 1;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `admin_forms_getAllFeedbackFacilitator` (IN `pageNo` INT, IN `pageSize` INT)   BEGIN

SET pageNo = (pageNo-1)*pageSize;

SELECT *
FROM forms_training_feedbackFacilitator
ORDER BY createdOn DESC
LIMIT pageSize
OFFSET pageNo;

SELECT COUNT(*)
AS "Total"
FROM forms_training_feedbackFacilitator;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `admin_forms_getAllFeedbackFacilitatorByAldpID` (IN `ID` INT, IN `pageNo` INT, IN `pageSize` INT)   BEGIN

SET pageNo = (pageNo-1)*pageSize;

SELECT *
FROM forms_training_feedbackFacilitator
WHERE aldpID = ID
ORDER BY createdOn DESC
LIMIT pageSize
OFFSET pageNo;

SELECT COUNT(*)
AS "Total"
FROM forms_training_feedbackFacilitator
WHERE aldpID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `admin_forms_getAllFeedbackFacilitatorByID` (IN `ID` INT)   BEGIN

SELECT *
FROM forms_training_feedbackFacilitator
WHERE FBfacilitatorID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `admin_forms_getAllFeedbackSpeaker` (IN `pageNo` INT, IN `pageSize` INT)   BEGIN

SET pageNo = (pageNo-1)*pageSize;

SELECT *
FROM forms_training_feedbackSpeaker
ORDER BY createdOn DESC
LIMIT pageSize
OFFSET pageNo;

SELECT COUNT(*)
AS "Total"
FROM forms_training_feedbackSpeaker;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `admin_forms_getAllFeedbackSpeakerByAldpID` (IN `ID` INT, IN `pageNo` INT, IN `pageSize` INT)   BEGIN

SET pageNo = (pageNo-1)*pageSize;

SELECT *
FROM forms_training_feedbackSpeaker
WHERE aldpID = ID
ORDER BY createdOn DESC
LIMIT pageSize
OFFSET pageNo;

SELECT COUNT(*)
AS "Total"
FROM forms_training_feedbackSpeaker
WHERE aldpID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `admin_forms_getAllFeedbackSpeakerByID` (IN `ID` INT)   BEGIN

SELECT * 
FROM forms_training_feedbackSpeaker
WHERE FBspeakerID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `admin_forms_getAllFormsByALDPID` (IN `apID_val` INT)   BEGIN

SELECT * FROM forms
WHERE apID = apID_val;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `admin_forms_getAllPrePost` (IN `pageNo` INT, IN `pageSize` INT)   BEGIN

SET pageNo = (pageNo-1)*pageSize;

SELECT *
FROM forms_training_prePostAnswerKey
ORDER BY createdOn DESC
LIMIT pageSize
OFFSET pageNo;

SELECT COUNT(*)
AS "Total"
FROM forms_training_prePostAnswerKey;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `admin_forms_getAllPrePostByAldpID` (IN `ID` INT, IN `pageNo` INT, IN `pageSize` INT)   BEGIN

SET pageNo = (pageNo-1)*pageSize;

SELECT *
FROM forms_training_prePostAnswerKey
WHERE aldpID = ID
ORDER BY createdOn
LIMIT pageSize
OFFSET pageNo;

SELECT COUNT(*)
AS "Total"
FROM forms_training_prePostAnswerKey
WHERE aldpID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `admin_forms_getAllPrograms` (IN `pageNo` INT, IN `pageSize` INT, IN `keyword` VARCHAR(50))   BEGIN

SET pageNo = (pageNo-1)*pageSize;

SELECT providerProgram.programName, availability.dateFrom, availability.dateTo, availability.fromTime, availability.toTime, trainingProvider.providerName, trainingprovider_Program.cost
FROM providerProgram
CROSS JOIN trainingProvider
LEFT JOIN availability
ON providerProgram.pprogID = availability.pprogID
LEFT JOIN trainingprovider_Program
ON availability.pprogID = trainingprovider_Program.pprogID
ORDER BY providerProgram.programName, trainingProvider.providerName, availability.fromTime DESC
LIMIT pageSize
OFFSET pageNo;

SELECT count(*)
AS "total"
FROM providerProgram
CROSS JOIN trainingProvider;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `admin_forms_getAllRegistration` (IN `pageNo` INT, IN `pageSize` INT)   BEGIN

SET pageNo = (pageNo-1)*pageSize;

SELECT *
FROM forms_registration
ORDER BY createdOn DESC
LIMIT pageSize
OFFSET pageNo;

SELECT COUNT(*)
AS "Total"
FROM forms_registration;


END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `admin_forms_getAllRegistrationByAldpID` (IN `ID` INT, IN `pageNo` INT, IN `pageSize` INT)   BEGIN

SET pageNo = (pageNo-1)*pageSize;

SELECT *
FROM forms_registration
WHERE aldpID = ID
ORDER BY createdOn DESC
LIMIT pageSize
OFFSET pageNo;

SELECT COUNT(*)
AS "Total"
FROM forms_registration
WHERE aldpID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `admin_forms_getFormByFormID` (IN `formID_val` INT)   BEGIN

SELECT 
    f.apID AS 'apID',
    f.type AS 'typeValue',
    CONCAT('[', GROUP_CONCAT(
        CONCAT(
            '{',
            '"type": "', content.type, '", ',
            '"required": "', content.required, '", ',
            '"label": "', content.label, '", ',
            '"options": [', 
                (SELECT GROUP_CONCAT(CONCAT('"', options.option_value, '"')) 
                 FROM forms_options AS options 
                 WHERE options.contentID = content.contentID),
            '], ',
            '"correct_answer": "', content.correct_answer, '"',
            '}'
        )
    ), ']') AS 'contents'
FROM 
    forms f
JOIN 
    forms_content AS content ON f.formID = content.formID
WHERE 
    f.formID = formID_val
GROUP BY 
    f.apID, f.type;
    
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `admin_forms_getPrePostByID` (IN `ID` INT)   BEGIN

SELECT *
FROM forms_training_prePostAnswerKey
WHERE ppAnsKeyID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `admin_forms_getRegistrationByID` (IN `ID` INT)   BEGIN

SELECT *
FROM forms_registration
WHERE formRegID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `admin_forms_updateFeedbackFacilitatorByID` (IN `ID` INT, IN `alID` INT, IN `quest` VARCHAR(255))   BEGIN

UPDATE forms_training_feedbackFacilitator
SET FBfacilitatorID = ID, aldpID = alID, question = quest
WHERE FBfacilitatorID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `admin_forms_updateFeedbackSpeakerByID` (IN `fbID` INT, IN `alID` INT, IN `quest` VARCHAR(255))   BEGIN

UPDATE forms_training_feedbackSpeaker
SET FBspeakerID = fbID, aldpID = alID, question = quest
WHERE FBspeakerID = fbID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `admin_forms_updateRegistrationByEmpID` (IN `ID` INT, IN `emID` INT, IN `cons` ENUM('Yes','No'))   BEGIN

UPDATE forms_registration
SET aldpID = ID, empID = emID, consent = cons
WHERE empID = emID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `admin_form_addOptionByContentID` (IN `contentID_val` INT, IN `option_val` VARCHAR(255))   BEGIN

INSERT INTO forms_options (contentID, option_value)
VALUES (contentID_val, option_val);


END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `admin_login` (IN `uName` VARCHAR(255))   SELECT `password` FROM admin WHERE username = uName$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `admin_register` (IN `ID` INT, IN `uName` VARCHAR(255), IN `pword` VARCHAR(255))   BEGIN

INSERT INTO admin (empID, username, password)
SELECT ID, uName, pword AS userAdmin
WHERE NOT EXISTS(SELECT empID, username, password FROM admin WHERE username = uName)
LIMIT 1;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `admin_scholarship_approveByID` (IN `ID` INT, IN `remarks` VARCHAR(100))   BEGIN

UPDATE scholarshipRequest
SET sreqStatus = 'Approved',
reqRemarks = remarks,
updatedOn = now() 
WHERE sreqID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `admin_scholarship_completed` (IN `ID` INT, IN `remarks` INT)   BEGIN

UPDATE scholarshipRequest
SET sreqStatus = 'Completed',
reqRemarks = remarks,
updatedOn = now() 
WHERE sreqID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `admin_scholarship_getAllForeignRequest` (IN `pageNo` INT, IN `pageSize` INT, IN `keyword` VARCHAR(50))   BEGIN

SET pageNo = (pageNo-1)*pageSize;

SELECT scholarshipRequest.sreqID, employees.lastname, employees.firstname, employees.middlename,
employees.position, scholarshipRequest.fieldOfStudy, scholarshipRequest.degree,
scholarshipRequest.preferredSchool, scholarshipRequest.academicYear,
scholarshipRequest.createdOn, scholarshipRequest.sreqStatus
FROM scholarshipRequest
LEFT JOIN employees
ON scholarshipRequest.empID = employees.empID
WHERE 
scholarshipRequest.fieldOfStudy 
LIKE (SELECT CONCAT('%', keyword, '%')) AND
scholarshipRequest.type = 'Foreign' AND
scholarshipRequest.sreqStatus = 'For L&D Approval' ||
scholarshipRequest.sreqStatus = 'Rejected by L&D' ||
scholarshipRequest.sreqStatus = 'Approved' ||
scholarshipRequest.sreqStatus = 'On-going' ||
scholarshipRequest.sreqStatus = 'Completed'
ORDER BY scholarshipRequest.updatedOn DESC
LIMIT pageSize OFFSET pageNo;

SELECT COUNT(sreqID) AS "total" FROM scholarshipRequest
WHERE 
scholarshipRequest.fieldOfStudy 
LIKE (SELECT CONCAT('%', keyword, '%')) AND
scholarshipRequest.type = 'Foreign' AND	
scholarshipRequest.sreqStatus = 'For L&D Approval' ||
scholarshipRequest.sreqStatus = 'Rejected by L&D' ||
scholarshipRequest.sreqStatus = 'Approved' ||
scholarshipRequest.sreqStatus = 'On-going' ||
scholarshipRequest.sreqStatus = 'Completed';

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `admin_scholarship_getAllLocalRequest` (IN `pageNo` INT, IN `pageSize` INT, IN `keyword` VARCHAR(50))   BEGIN

SET pageNo = (pageNo-1)*pageSize;

SELECT scholarshipRequest.sreqID, employees.lastname, employees.firstname, employees.middlename,
employees.position, scholarshipRequest.fieldOfStudy, scholarshipRequest.degree,
scholarshipRequest.preferredSchool, scholarshipRequest.academicYear,
scholarshipRequest.createdOn, scholarshipRequest.sreqStatus
FROM scholarshipRequest
LEFT JOIN employees
ON scholarshipRequest.empID = employees.empID
WHERE 
scholarshipRequest.fieldOfStudy 
LIKE (SELECT CONCAT('%', keyword, '%')) AND
scholarshipRequest.type = 'Local' AND
scholarshipRequest.sreqStatus = 'For L&D Approval' ||
scholarshipRequest.sreqStatus = 'Rejected by L&D' ||
scholarshipRequest.sreqStatus = 'Approved' ||
scholarshipRequest.sreqStatus = 'On-going' ||
scholarshipRequest.sreqStatus = 'Completed'
ORDER BY scholarshipRequest.updatedOn DESC
LIMIT pageSize OFFSET pageNo;

SELECT COUNT(sreqID) AS "total" FROM scholarshipRequest
LEFT JOIN employees
ON scholarshipRequest.empID = employees.empID
WHERE 
scholarshipRequest.fieldOfStudy 
LIKE (SELECT CONCAT('%', keyword, '%')) AND
scholarshipRequest.type = 'Local' AND	
scholarshipRequest.sreqStatus = 'For L&D Approval' ||
scholarshipRequest.sreqStatus = 'Rejected by L&D' ||
scholarshipRequest.sreqStatus = 'Approved' ||
scholarshipRequest.sreqStatus = 'On-going' ||
scholarshipRequest.sreqStatus = 'Completed';

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `admin_scholarship_getByID` (IN `ID` INT)   BEGIN

SELECT * FROM scholarshipRequest
WHERE sreqID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `admin_scholarship_ongoing` (IN `ID` INT, IN `remarks` INT)   BEGIN

UPDATE scholarshipRequest
SET sreqStatus = 'On-going',
reqRemarks = remarks,
updatedOn = now() 
WHERE sreqID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `admin_scholarship_onhold` (IN `ID` INT, IN `remarks` INT)   BEGIN

UPDATE scholarshipRequest
SET sreqStatus = 'On-hold',
reqRemarks = remarks,
updatedOn = now() 
WHERE sreqID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `admin_scholarship_rejectByID` (IN `ID` INT, IN `remarks` VARCHAR(100))   BEGIN

UPDATE scholarshipRequest
SET sreqStatus = 'Rejected by L&D', 
reqRemarks = remarks,
updatedOn = now()
WHERE sreqID =ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `admin_tprov_getAllTPdd` ()   BEGIN

SELECT DISTINCT trainingProvider.provID, trainingProvider.providerName 
FROM trainingProvider
JOIN trainingprovider_program
ON trainingprovider.provID = trainingprovider_program.provID
WHERE trainingProvider.status ='Active';

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `admin_userExist` (IN `uName` VARCHAR(50))   BEGIN

SELECT * FROM admin WHERE username = uName;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `all_certificates_getAllCertificateByEmpID` (IN `ID` INT)   BEGIN

SELECT certID, programName, description, trainingprovider, type,
startDate, endDate, pdf_content, cert_status, createdOn
FROM certificates
WHERE empID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `all_certificate_getAllCertificateByEmpIDByDivision` (IN `eID` INT, IN `dID` INT)   BEGIN

SELECT db1.certID, db1.programName, db1.description, db1.trainingprovider,
db1.type, db1.startDate, db1.endDate, db1.pdf_content, db1.createdOn
FROM `mirdc2`.`certificates` AS db1
LEFT JOIN `employees`.`employee` AS db2
ON db1.`empID` = db2.`empID`
WHERE db1.`empID` = eID AND db2.`divID` = dID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `all_certificate_uploadCertificate` (IN `progName` VARCHAR(255), IN `descrip` VARCHAR(255), IN `trainProvider` VARCHAR(255), IN `startD` DATE, IN `endD` DATE, IN `pdf` BLOB, IN `ID` INT)   BEGIN

INSERT INTO certificates (
    programName, description, trainingprovider, type, startDate, endDate,
    pdf_content, empID
)
VALUES (
    progName, descrip, trainProvider, 'Self-initiated', startD, endD, pdf, ID
);

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `all_competency_assigned_getAllCompetencyByUser` (IN `ID` INT)   BEGIN

SELECT db1.`ID`, db1.`competency`, db1.`specificLearning`, 
db2.`targetDate`, 
db2.`compStatus`, db2.`remarks`, db2.`createdOn`
FROM `mirdc2`.`competency_planned` AS db2
LEFT JOIN `cmis`.`competency` as db1
ON db2.`pID` = db1.`ID`
WHERE db1.`empID` = ID AND
db2.`compStatus` = "For L&D Approval" || 
db2.`compStatus` = "Approved" || 
db2.`compStatus` = "Pending"
;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `all_getAllCompletedCompetencyByEmpID` (IN `eID` INT)   BEGIN

SELECT db1.`ID`, db1.`competency`, db1.`specificLearning`, 
db2.`targetDate`, 
db2.`compStatus`, db2.`remarks`, db2.`createdOn`
FROM `mirdc2`.`competency_planned` AS db2
LEFT JOIN `cmis`.`competency` as db1
ON db2.`pID` = db1.`ID`
WHERE db1.`empID` = eID AND
db2.`compStatus` = "Served";

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `all_getAllUnservedCompetencyByEmpID` (IN `eID` INT)   BEGIN

SELECT db1.`ID`, db1.`competency`, db1.`specificLearning`, 
db2.`targetDate`, 
db2.`compStatus`, db2.`remarks`, db2.`createdOn`
FROM `mirdc2`.`competency_planned` AS db2
LEFT JOIN `cmis`.`competency` as db1
ON db2.`pID` = db1.`ID`
WHERE db1.`empID` = eID AND
db2.`compStatus` = "Unserved";

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `auditLogs_admin_getEmpIDbyUsername` (IN `uName` VARCHAR(50))   BEGIN 

SELECT empID FROM admin WHERE username = uName;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `auditLogs_divChief_competency` (IN `uName` VARCHAR(255))   BEGIN

SELECT empID FROM admin WHERE username = uName;

INSERT INTO audit_logs (username, target, action) 
VALUES (uName, 'Competency', 'Modify');

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `auditLogs_getAll` (IN `pageNo` INT, IN `pageSize` INT, IN `startDate` TIMESTAMP, IN `endDate` TIMESTAMP)   BEGIN	

SET pageNo = (pageNo-1)*pageSize;

SELECT * FROM audit_logs 
WHERE (createdOn BETWEEN startDate AND endDate)
ORDER BY createdOn DESC LIMIT pageSize OFFSET pageNo;



END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `avail_createAvailability` (IN `tprovID` INT, IN `progID` INT, IN `fromD` DATE, IN `fromT` TIME, IN `toD` DATE, IN `toT` TIME)   BEGIN 

INSERT INTO availability (provID, pprogID, dateFrom, fromTime, dateTo, toTime)
SELECT tprovID, progID, fromD, fromT, toD, toT 
WHERE NOT EXISTS (SELECT provID, pprogID, dateFrom, fromTime, dateTo, toTime FROM availability WHERE provID = tprovID AND pprogID = progID AND dateFrom = fromD AND fromTime = fromT AND dateTo = toD AND toTime = toT) LIMIT 1;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `avail_disableAvailabilityByAvailID` (IN `ID` INT)   BEGIN

UPDATE availability SET status = 'Not Available', disabledOn = now() WHERE availID = ID; 

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `avail_getAllAvailability` (IN `pageNo` INT, IN `pageSize` INT)   BEGIN

SET pageNo = (pageNo-1)*pageSize;

SELECT * FROM availability ORDER BY availID DESC LIMIT pageSize OFFSET pageNo;

SELECT COUNT(availID) AS "total" FROM availability ;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `avail_getAllAvailabilityByProviderandProgram` (IN `pID` INT, IN `tID` INT)   BEGIN

SELECT availability.dateFrom, availability.fromTime, 
availability.dateTo, availability.toTime, 
trainingprovider_Program.cost, availability.status
FROM providerProgram
JOIN trainingprovider_Program
ON providerProgram.pprogID = trainingprovider_Program.pprogID
JOIN availability
ON tID = availability.provID AND pID = availability.pprogID
WHERE providerProgram.pprogID = pID AND 
trainingprovider_Program.provID = tID
ORDER BY availability.dateFrom;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `avail_getAvailabilityByProgramID` (IN `ID` INT)   BEGIN 

SELECT * FROM availability WHERE pprogID = ID;

SELECT COUNT(pprogID) FROM availability WHERE pprogID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `avail_updateAvailabilityByAvailID` (IN `ID` INT, IN `fromD` DATE, IN `fromT` TIME, IN `toD` DATE, IN `toT` TIME)   BEGIN 

UPDATE availability SET dateFrom = fromD, fromTime = fromT, dateTo = toD, toTime = toT WHERE availID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `competency_getAllCompetency` (IN `pageNo` INT(20), IN `pageSize` INT(20), IN `keyword` VARCHAR(50))   BEGIN

SET pageNo = (pageNo-1)*pageSize;

SELECT competencies.compID, competencies.competencyName, division.divisionName, division.divisionChief, competencies.createdOn, competencies.compStatus FROM competencies 
LEFT JOIN division ON
competencies.divID = division.divID
WHERE compStatus = 'For L&D Approval' OR
divisionName LIKE (SELECT CONCAT('%',keyword,'%'))OR
divisionChief LIKE (SELECT CONCAT('%',keyword,'%'))OR
competencyName LIKE (SELECT CONCAT('%',keyword,'%')) 
LIMIT pageSize OFFSET pageNo;

SELECT COUNT(compID) AS "total" FROM competencies
WHERE compStatus = 'For L&D Approval';


END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `competency_getAllCompetencyWfilter` (IN `pageNo` INT, IN `pageSize` INT, IN `ffrom` DATE, IN `fto` DATE)   BEGIN

SET pageNo = (pageNo-1)*pageSize;

SELECT * FROM competencies
WHERE createdOn >= ffrom AND
createdOn < fto
ORDER BY createdOn DESC
LIMIT pageSize
OFFSET pageNo;



END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `competency_getCompetencyByID` (IN `ID` INT)   BEGIN

SELECT competencies.competencyName,
competencies.KPItoSupport,
division.divisionName,
division.divisionChief,
competencies.updateddOn,
competencies.levelOfPriority,
competencies.targetDate,
competencies.compStatus
FROM competencies
LEFT JOIN division
ON competencies.divID = division.divID
WHERE compID = ID ;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `competency_updateCompetency` (IN `ID` INT, IN `LRemarks` VARCHAR(100), IN `LDinter` VARCHAR(100), IN `supNeed` VARCHAR(100), IN `budg` VARCHAR(20), IN `fund` VARCHAR(100), IN `target` DATE, IN `prio` YEAR, IN `status` ENUM('Pending Approval from Division Chief','Pending Approval from L&D','Rejected by Division Chief','Approved','Rejected by L&D','Completed'))   BEGIN

UPDATE competency SET LDappDate = now(), LDremarks = LRemarks, assignedTo = 'sytemUser', LDintervention = LDinter, supportNeeded = supNeed, budget = budg, sourceOfFunds = fund, targetDate = target, priority = prio, completedDate = now(), compStatus = status, updatedOn = now() WHERE compID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `divChief_competency_getAllPlannedCompetencyByDivision` (IN `ID` INT)   BEGIN

SELECT db1.`ID`, db1.`competency`, db1.`specificLearning`, 
db2.`lastName`, db2.`firstName`, db2.`middleName`, 
db1.`empExistingProficiency`,
db1.`reqProficiency`, db1.`priority`, db1.`ld_intervention`
FROM `cmis`.`competency` AS db1
LEFT JOIN `employees`.`employee` AS db2
ON db1.`empID` = db2.`empID`
LEFT JOIN `employees`.`division` AS db3
ON db2.`divID` = db3.`divID`
WHERE db3.`divID` = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `divChief_createCompetencyByDivision` (IN `dID` INT, IN `Name` VARCHAR(100), IN `KPI` VARCHAR(255), IN `Prio` ENUM('Low','Medium','High'), IN `Target` DATE, IN `Remarkss` VARCHAR(255))   BEGIN

INSERT INTO competencies (divID, competencyName, KPItoSupport, levelOfPriority, targetDate, remarks)
SELECT dID, Name, KPI, Prio, Target, Remarkss
WHERE NOT EXISTS
(SELECT divID, competencyName, KPItoSupport, levelOfPriority, targetDate, remarks
 FROM competencies
 WHERE competencyName = Name AND KPItoSupport = KPI)
 LIMIT 1;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `divChief_getAllApprovedRequestByDivID` (IN `ID` INT, IN `pageNo` INT, IN `pageSize` INT, IN `keyword` VARCHAR(50))   BEGIN

SET pageNo = (pageNo-1)*pageSize;

SELECT competencyRequest.reqID, competencyRequest.specificLDNeeds, 
competencyRequest.levelOfProficiency, employees.lastname, employees.firstname, employees.middlename, competencyRequest.createdOn, competencyRequest.reqStatus
FROM competencyRequest 
LEFT JOIN employees 
ON competencyRequest.empID = employees.empID
WHERE 
divID = ID AND 
competencyRequest.reqStatus = 'Approved'
LIMIT pageSize OFFSET pageNo;

                    
SELECT COUNT(*) AS "total" FROM competencyRequest 
LEFT JOIN employees 
ON competencyRequest.empID = employees.empID
WHERE 
divID = ID AND 
competencyRequest.reqStatus = 'Approved';  
                           
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `divChief_getAllCompetencyDropdown` ()   BEGIN

SELECT compID, competencyName FROM competencies;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `divChief_getAllCreatedCompetencyByDivChief` (IN `ID` INT, IN `pageNo` INT, IN `pageSize` INT, IN `keyword` VARCHAR(50))   BEGIN

SET pageNo = (pageNo-1)*pageSize;

SELECT competencies.competencyName, competencies.KPItoSupport, competencies.levelOfPriority, competencies.targetDate, competencies.compStatus, competencies.remarks, competencies.createdOn 
FROM competencies
WHERE divID = ID AND
competencies.competencyName LIKE (SELECT CONCAT('%', keyword, '%'))
ORDER BY competencies.createdOn DESC
LIMIT pageSize OFFSET pageNo;

SELECT COUNT(*) AS "total" FROM competencies 
WHERE divID = ID; 

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `divChief_getAllCreatedCompetencyByDivisionForDropdown` (IN `ID` INT)   BEGIN

SELECT compID, competencyName
FROM competencies
WHERE divID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `divchief_getAllMergedRequestWithCompetencyByCompID` (IN `ID` INT)   BEGIN


SELECT competencyRequest.specificLDNeeds, 
competencyRequest.levelOfProficiency, employees.lastname, employees.firstname, employees.middlename, competencyRequest.createdOn
FROM competencyRequest 
LEFT JOIN employees 
ON competencyRequest.empID = employees.empID
LEFT JOIN compReq_Competencies 
ON competencyRequest.reqID = compReq_Competencies.reqID
WHERE 
compReq_Competencies.compID = ID;


                           
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `divChief_getAllPendingRequestByDivID` (IN `ID` INT, IN `pageNo` INT, IN `pageSize` INT, IN `keyword` VARCHAR(50))   BEGIN

SET pageNo = (pageNo-1)*pageSize;

SELECT competencyRequest.reqID, competencyRequest.specificLDNeeds, 
competencyRequest.levelOfProficiency, employees.lastname, employees.firstname, employees.middlename, competencyRequest.createdOn, competencyRequest.reqStatus
FROM competencyRequest 
LEFT JOIN employees 
ON competencyRequest.empID = employees.empID
WHERE 
divID = ID AND 
competencyRequest.reqStatus = 'For Division Chief Approval'|| competencyRequest.reqStatus = 'For L&D Approval'
LIMIT pageSize OFFSET pageNo;

                    
SELECT COUNT(*) AS "total" FROM competencyRequest 
LEFT JOIN employees 
ON competencyRequest.empID = employees.empID
WHERE 
divID = ID AND 
competencyRequest.reqStatus = 'For Division Chief Approval'|| competencyRequest.reqStatus = 'For L&D Approval';  
                           
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `divChief_getAllPendingRequestFromAdminByDivID` (IN `ID` INT, IN `pageNo` INT, IN `pageSize` INT, IN `keyword` VARCHAR(50))   BEGIN

SET pageNo = (pageNo-1)*pageSize;

SELECT competencyRequest.reqID, competencyRequest.specificLDNeeds, 
competencyRequest.levelOfProficiency, employees.lastname, employees.firstname, employees.middlename, competencyRequest.createdOn, competencyRequest.reqStatus
FROM competencyRequest 
LEFT JOIN employees 
ON competencyRequest.empID = employees.empID
WHERE 
divID = ID AND 
competencyRequest.reqStatus = 'For L&D Approval'
LIMIT pageSize OFFSET pageNo;

                    
SELECT COUNT(*) AS "total" FROM competencyRequest 
LEFT JOIN employees 
ON competencyRequest.empID = employees.empID
WHERE 
divID = ID AND 
competencyRequest.reqStatus = 'For L&D Approval';  
                           
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `divChief_getAllPendingRequestFromDChiefByDivID` (IN `ID` INT, IN `pageNo` INT, IN `pageSize` INT, IN `keyword` VARCHAR(50))   BEGIN

SET pageNo = (pageNo-1)*pageSize;

SELECT competencyRequest.reqID, competencyRequest.specificLDNeeds, 
competencyRequest.levelOfProficiency, employees.lastname, employees.firstname, employees.middlename, competencyRequest.createdOn, competencyRequest.reqStatus
FROM competencyRequest 
LEFT JOIN employees 
ON competencyRequest.empID = employees.empID
WHERE 
divID = ID AND 
competencyRequest.reqStatus = 'For Division Chief Approval'
LIMIT pageSize OFFSET pageNo;

                    
SELECT COUNT(*) AS "total" FROM competencyRequest 
LEFT JOIN employees 
ON competencyRequest.empID = employees.empID
WHERE 
divID = ID AND 
competencyRequest.reqStatus = 'For Division Chief Approval';  
                           
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `divChief_getAllRejectedRequestByAdmin` (IN `ID` INT, IN `pageNo` INT, IN `pageSize` INT, IN `keyword` VARCHAR(50))   BEGIN

SET pageNo = (pageNo-1)*pageSize;

SELECT competencyRequest.reqID, competencyRequest.specificLDNeeds, 
competencyRequest.levelOfProficiency, employees.lastname, employees.firstname, employees.middlename, competencyRequest.createdOn, competencyRequest.reqStatus
FROM competencyRequest 
LEFT JOIN employees 
ON competencyRequest.empID = employees.empID
WHERE 
divID = ID AND 
competencyRequest.reqStatus = 'Rejected by L&D'
LIMIT pageSize OFFSET pageNo;

                    
SELECT COUNT(*) AS "total" FROM competencyRequest 
LEFT JOIN employees 
ON competencyRequest.empID = employees.empID
WHERE 
divID = ID AND 
competencyRequest.reqStatus = 'Rejected by L&D';  
                           
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `divChief_getAllRejectedRequestByDChief` (IN `ID` INT, IN `pageNo` INT, IN `pageSize` INT, IN `keyword` VARCHAR(50))   BEGIN

SET pageNo = (pageNo-1)*pageSize;

SELECT competencyRequest.reqID, competencyRequest.specificLDNeeds, 
competencyRequest.levelOfProficiency, employees.lastname, employees.firstname, employees.middlename, competencyRequest.createdOn, competencyRequest.reqStatus
FROM competencyRequest 
LEFT JOIN employees 
ON competencyRequest.empID = employees.empID
WHERE 
divID = ID AND 
competencyRequest.reqStatus = 'Rejected by Division Chief'
LIMIT pageSize OFFSET pageNo;

                    
SELECT COUNT(*) AS "total" FROM competencyRequest 
LEFT JOIN employees 
ON competencyRequest.empID = employees.empID
WHERE 
divID = ID AND 
competencyRequest.reqStatus = 'Rejected by Division Chief';  
                           
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `divChief_getAllRejectedRequestByDivID` (IN `ID` INT, IN `pageNo` INT, IN `pageSize` INT, IN `keyword` VARCHAR(50))   BEGIN

SET pageNo = (pageNo-1)*pageSize;

SELECT competencyRequest.reqID, competencyRequest.specificLDNeeds, 
competencyRequest.levelOfProficiency, employees.lastname, employees.firstname, employees.middlename, competencyRequest.createdOn, competencyRequest.reqStatus
FROM competencyRequest 
LEFT JOIN employees 
ON competencyRequest.empID = employees.empID
WHERE 
divID = ID AND 
competencyRequest.reqStatus = 'Rejected by Division Chief' || competencyRequest.reqStatus = 'Rejected by L&D'
LIMIT pageSize OFFSET pageNo;

                    
SELECT COUNT(*) AS "total" FROM competencyRequest 
LEFT JOIN employees 
ON competencyRequest.empID = employees.empID
WHERE 
divID = ID AND 
competencyRequest.reqStatus = 'Rejected by Division Chief' || competencyRequest.reqStatus = 'Rejected by L&D';  
                           
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `divChief_getAllRequestByDivision` (IN `ID` INT, IN `pageNo` INT, IN `pageSize` INT, IN `keyword` VARCHAR(20))   BEGIN

SET pageNo = (pageNo-1)*pageSize;

SELECT competencyRequest.reqID, competencyRequest.specificLDNeeds, 
competencyRequest.levelOfProficiency, employees.lastname, employees.firstname, employees.middlename, competencyRequest.createdOn, competencyRequest.reqStatus
FROM competencyRequest 
LEFT JOIN employees 
ON competencyRequest.empID = employees.empID
WHERE 
competencyRequest.specificLDNeeds LIKE (
    SELECT CONCAT('%', keyword, '%')
) OR
competencyRequest.levelOfProficiency  LIKE (
    SELECT CONCAT('%', keyword, '%')
) OR
employees.lastname LIKE (
    SELECT CONCAT('%', keyword, '%')
) OR
employees.firstname LIKE (
    SELECT CONCAT('%', keyword, '%')
) OR
employees.middlename LIKE (
    SELECT CONCAT('%', keyword, '%')
) OR
competencyRequest.createdOn LIKE (
    SELECT CONCAT('%', keyword, '%')
) AND
competencyRequest.empID IN (SELECT empID FROM employees where divID = ID)
ORDER BY reqID DESC LIMIT pageSize OFFSET pageNo;
                    
SELECT COUNT(*) AS "total" FROM competencyRequest WHERE empID IN (SELECT empID FROM employees where divID = ID);                             
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `divChief_getCompetencyByID` (IN `ID` INT)   BEGIN

SELECT * FROM competencies WHERE compID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `divChief_getRequestByID` (IN `ID` INT)   BEGIN

SELECT employees.lastname, employees.firstname, employees.middlename, competencyRequest.specificLDNeeds, competencyRequest.levelOfProficiency, competencyRequest.reqStatus, competencyRequest.reqRemarks, competencyRequest.createdOn 
FROM competencyRequest
LEFT JOIN employees
ON competencyRequest.empID = employees.empID
WHERE reqID = ID;

SELECT COUNT(*) FROM competencyRequest 
WHERE reqID = ID;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `divChief_login` (IN `uName` VARCHAR(255))   BEGIN

SELECT division.divID, users.password
FROM users
LEFT JOIN employees
ON users.empID = employees.empID
LEFT JOIN division
ON employees.divID = division.divID
WHERE users.username = uName AND users.role = 'Division Chief';

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `divChief_mergeRequestToCompetency` (IN `cID` INT, IN `rID` INT)   BEGIN

INSERT INTO compReq_Competencies (compID, reqID)
SELECT cID, rID
WHERE NOT EXISTS(SELECT compID, reqID FROM compReq_Competencies
WHERE compID = cID AND reqID = rID)
LIMIT 1;

UPDATE competencyRequest SET reqStatus = 'For L&D Approval', updatedOn = now() WHERE reqID = rID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `divChief_register` (IN `ID` INT, IN `uName` VARCHAR(255), IN `pword` VARCHAR(255))   BEGIN

INSERT INTO users (empID, username, password, role)
SELECT ID, uName, pword, 'Division Chief' AS userDChief
WHERE NOT EXISTS(SELECT empID, username, password, role FROM users WHERE username = uName)
LIMIT 1;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `divChief_scholarship_approveRequestByID` (IN `ID` INT, IN `remarks` VARCHAR(100))   BEGIN

UPDATE scholarshipRequest
SET sreqStatus = 'For L&D Approval',
reqRemarks = remarks,
updatedOn = now() 
WHERE sreqID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `divChief_scholarship_getAllForeignRequestByDIvision` (IN `ID` INT, IN `pageNo` INT, IN `pageSize` INT, IN `keyword` VARCHAR(20))   BEGIN

SET pageNo = (pageNo-1)*pageSize;

SELECT scholarshipRequest.sreqID, employees.lastname,employees.firstname, employees.middlename, employees.position, scholarshipRequest.degree, scholarshipRequest.fieldOfStudy, scholarshipRequest.preferredSchool, scholarshipRequest.academicYear, scholarshipRequest.createdOn, scholarshipRequest.sreqStatus, 
scholarshipRequest.reqRemarks
FROM scholarshipRequest 
LEFT JOIN employees 
ON scholarshipRequest.empID = employees.empID
WHERE scholarshipRequest.fieldOfStudy
LIKE (SELECT CONCAT('%', keyword, '%')) AND
divID = ID AND scholarshipRequest.type = 'Foreign' 
ORDER BY scholarshipRequest.updatedOn
LIMIT pageSize OFFSET pageNo;

                    
SELECT COUNT(*) AS "total" FROM scholarshipRequest 
LEFT JOIN employees 
ON scholarshipRequest.empID = employees.empID
WHERE 
divID = ID AND scholarshipRequest.type = 'Foreign' ;
                           
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `divChief_scholarship_getAllLocalRequestByDIvision` (IN `ID` INT, IN `pageNo` INT, IN `pageSize` INT, IN `keyword` VARCHAR(20))   BEGIN

SET pageNo = (pageNo-1)*pageSize;

SELECT scholarshipRequest.sreqID, employees.lastname,employees.firstname, employees.middlename, employees.position, scholarshipRequest.degree, scholarshipRequest.fieldOfStudy, scholarshipRequest.preferredSchool, scholarshipRequest.academicYear, scholarshipRequest.createdOn, scholarshipRequest.sreqStatus, 
scholarshipRequest.reqRemarks
FROM scholarshipRequest 
LEFT JOIN employees 
ON scholarshipRequest.empID = employees.empID
WHERE scholarshipRequest.fieldOfStudy
LIKE (SELECT CONCAT('%', keyword, '%')) AND
divID = ID AND scholarshipRequest.type = 'Local'
ORDER BY scholarshipRequest.updatedOn DESC
LIMIT pageSize OFFSET pageNo;

                    
SELECT COUNT(*) AS "total" FROM scholarshipRequest 
LEFT JOIN employees 
ON scholarshipRequest.empID = employees.empID
WHERE 
divID = ID AND scholarshipRequest.type = 'Local'
ORDER BY scholarshipRequest.updatedOn DESC;
                           
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `divChief_scholarship_getByID` (IN `ID` INT)   BEGIN

SELECT * FROM scholarshipRequest WHERE scholarshipRequest.sreqID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `divChief_scholarship_rejectRequestByID` (IN `ID` INT, IN `remarks` VARCHAR(100))   BEGIN

UPDATE scholarshipRequest
SET sreqStatus = 'Rejected by Division Chief', 
reqRemarks = remarks,
updatedOn = now()
WHERE sreqID =ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `divChief_updateDivStatusApproved` (IN `ID` INT)   BEGIN

UPDATE competencyRequest SET reqStatus = 'For L&D Approval', updatedOn = now() WHERE reqID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `divChief_updateDivStatusReject` (IN `ID` INT, IN `dRemarks` VARCHAR(255))   BEGIN

UPDATE competencyRequest SET reqStatus = 'Rejected by Division Chief', reqRemarks = dRemarks, updatedOn = now() WHERE reqID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `division_competencyLD_approveCompetencyByDivision` (IN `cID` INT)   BEGIN

SELECT ID INTO @compID
FROM cmis.competency
WHERE ID = cID;

INSERT INTO mirdc2.competency_planned (
    pID, compStatus
)
VALUES (@compID, "For L&D Approval");

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `div_createDivision` (IN `divName` VARCHAR(100), IN `divChief` VARCHAR(100))   BEGIN

INSERT INTO division (divisionName, divisionChief) 
SELECT divName, divChief
WHERE NOT EXISTS (SELECT divisionName, divisionChief FROM division WHERE divisionName = divName AND divisionChief = divChief) LIMIT 1;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `div_disableDivisionByID` (IN `ID` INT)   BEGIN

UPDATE division SET divStatus = 'Inactive', disabledOn = now() WHERE divID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `div_enableDivisionByID` (IN `ID` INT)   BEGIN 

UPDATE division SET divStatus = 'Active', updatedOn = now() WHERE divID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `div_getAllDivision` (IN `pageNo` INT, IN `pageSize` INT)   BEGIN

SET pageNo = (pageNo-1)*pageSize;

SELECT * FROM division LIMIT pageSize OFFSET pageNo;

SELECT COUNT(divID) AS "total" FROM division;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `div_getDivisionByID` (IN `ID` INT)   BEGIN

SELECT * FROM division WHERE divID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `div_updateDivision` (IN `ID` INT, IN `divName` VARCHAR(100), IN `divChief` VARCHAR(100))   BEGIN

UPDATE division SET divisionName = divName, divisionChief = divChief WHERE divID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `emp_createEmployees` (IN `empNo` INT, IN `dID` INT, IN `lastn` VARCHAR(20), IN `firstn` VARCHAR(50), IN `middlen` VARCHAR(20), IN `emailAdd` VARCHAR(100), IN `gen` ENUM('Female','Male'), IN `estatus` ENUM('Contractual','Probationary','Regular','Resigned','Retracted'), IN `pos` VARCHAR(100), IN `salary` VARCHAR(50), IN `bday` DATE, IN `relig` VARCHAR(50), IN `special` ENUM('PWD','Immuno-Compromised','None'))   BEGIN


INSERT INTO employees (employeeNo, divID, lastname, firstname, middlename,  
                       emailAddress, gender, employmentStat, position, salaryGrade,
                       birthday, religion, specialNeeds) 
SELECT empNo, dID, lastn, firstn, middlen, emailAdd, gen, estatus, pos,
salary, bday, relig, special
WHERE NOT EXISTS (SELECT employeeNo, divID, lastname, firstname,
                  middlename, emailAddress, gender, 
                  employmentStat, position, salaryGrade, 
                  birthday, religion, specialNeeds 
                  FROM employees WHERE employeeNo = empNo AND
                  divID = dID AND lastname = lastn AND 
                  firstname = firstn AND middlename = middlen AND
                 emailAddress = emailAdd)
                  LIMIT 1;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `emp_disabeEmployeeByID` (IN `ID` INT)   BEGIN

UPDATE employees
SET employmentStat = 'Inactive', deactivatedOn = now()
WHERE empID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `emp_enableEmployeeByID` (IN `ID` INT)   BEGIN 

UPDATE employees SET STATUS = 'Active', employmentStat = 'Retracted', lastUpdateOn = now() WHERE empID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `emp_getAllEmployees` (IN `pageNo` INT, IN `pageSize` INT)   BEGIN	

SET pageNo = (pageNo-1)*pageSize;

SELECT *, TIMESTAMPDIFF(YEAR, employees.birthday, CURDATE()) as age
FROM employees ORDER BY employmentStat, lastname DESC LIMIT pageSize OFFSET pageNo;

SELECT COUNT(empID) AS "total" FROM employees;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `emp_getAllEmployeesByDIvisionID` (IN `ID` INT, IN `pageNo` INT, IN `pageSize` INT)   BEGIN

SET pageNo = (pageNo-1)*pageSize;

SELECT *
FROM employees
WHERE divID = ID
ORDER BY lastname, firstname
LIMIT pageSize
OFFSET pageNo;

SELECT COUNT(*)
FROM employees
WHERE divID = ID;


END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `emp_getEmployeeByID` (IN `ID` INT)   BEGIN

SELECT * ,TIMESTAMPDIFF(YEAR, employees.birthday, CURDATE()) 
as age FROM employees WHERE empID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `emp_updateByID` (IN `ID` INT, IN `empNo` INT, IN `dID` VARCHAR(100), IN `lastn` VARCHAR(50), IN `firstn` VARCHAR(50), IN `middlen` VARCHAR(50), IN `email` VARCHAR(100), IN `gen` ENUM('Female','Male'), IN `estatus` ENUM('Contractual','Probationary','Regular','Resigned'), IN `pos` VARCHAR(100), IN `salary` VARCHAR(50), IN `bday` DATE, IN `relig` VARCHAR(50), IN `special` ENUM('PWD','Immuno-Compromised','None'))   BEGIN

UPDATE employees SET employeeNo = empNo, lastname = lastn, firstname = firstn, middlename = middlen, emailAdd = email, gender = gen, employmentStat = estatus, position = pos, salaryGrade = salary, birthday = bday, religion = relig, specialNeeds = special, lastUpdatedOn = now() WHERE empID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `Forms_admin_getAllPogram` ()   BEGIN

SELECT 
    a.apID,
    pp.programName,
    av.dateFrom,
    av.dateTo,
    av.fromTime,
    av.toTime,
    tp.providerName,
    tp_p.cost
FROM 
    aldp_proposed AS a
JOIN 
    trainingprovider_program AS tp_p ON a.tpID = tp_p.tpID
JOIN 
    providerprogram AS pp ON tp_p.pprogID = pp.pprogID
JOIN 
    trainingProvider AS tp ON tp_p.provID = tp.provID
JOIN 
    availability AS av ON tp_p.provID = av.provID AND tp_p.pprogID = av.pprogID
WHERE 
	a.aldpStatus = 'Approved'
    AND pp.status = 'Available'
    AND tp.status = 'Active'
    AND av.status = 'Available';
    
 END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `payment_createPayment` (IN `payeeName` VARCHAR(100), IN `account` VARCHAR(15), IN `pID` INT(7), IN `paymentOpt` ENUM('Cash','Bank','E-wallet'), IN `bName` VARCHAR(100), IN `taxID` VARCHAR(12))   BEGIN

INSERT INTO paymentOpt (payee, accountNo, provID, 
ddPaymentOpt, bankName, TIN)
SELECT payeeName, account, pID, paymentOpt, bName, taxID
WHERE NOT EXISTS (SELECT payee, accountNo, provID, ddPaymentOpt, bankName, TIN FROM paymentOpt 
WHERE payee = payeeName AND accountNo = account AND bankName = bName) LIMIT 1;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `payment_disablePaymentOptByID` (IN `ID` INT)   BEGIN 

UPDATE paymentOpt SET STATUS = 'Inactive', disabledOn = now() WHERE paymentOptID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `payment_disablePaymentOptByTrainingProvider` (IN `ID` INT)   BEGIN


UPDATE paymentOpt SET status = 'Inactive', disabledOn = now() WHERE paymentOptID IN(SELECT paymentOptID FROM paymentOpt WHERE provID = ID);

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `payment_enablePaymentOptByID` (IN `ID` INT)   BEGIN 

UPDATE paymentOpt SET status = 'Active', updatedOn = now() WHERE paymentOptID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `payment_getAllInactivePaymentByProvID` (IN `ID` INT)   BEGIN

SELECT *
FROM paymentOpt
WHERE provID = ID
AND status = 'Inactive';

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `payment_getAllPaymentOpt` (IN `pageNo` INT, IN `pageSize` INT)   BEGIN	

SET pageNo = (pageNo-1)*pageSize;

SELECT * FROM paymentOpt 
ORDER BY paymentOptID DESC LIMIT pageSize OFFSET pageNo;

SELECT COUNT(paymentOptID) AS "total" FROM paymentOpt;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `payment_getPaymentOptByID` (IN `ID` INT)   BEGIN

SELECT * FROM paymentOpt WHERE paymentOptID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `payment_getPaymentOptByProvID` (IN `ID` INT)   BEGIN

SELECT * FROM paymentOpt WHERE provID = ID AND status = 'Active';

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `payment_updatePaymentOptByID` (IN `ID` INT, IN `payeeName` VARCHAR(100), IN `account` VARCHAR(15), IN `paymentOpt` ENUM('Cash','Bank','E-wallet'), IN `bName` VARCHAR(100), IN `taxID` VARCHAR(12))   BEGIN

UPDATE paymentOpt SET payee = payeeName, accountNo = account, ddPaymentOpt = paymentOpt, bankName = bName, TIN = taxID, updatedOn = now() WHERE paymentOptID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pprog_availProgram` (IN `ID` INT)   BEGIN

UPDATE providerProgram 
SET STATUS = 'Availed', updatedOn = now() 
WHERE pprogID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pprog_cancelProgram` (IN `ID` INT)   BEGIN

UPDATE providerProgram 
SET STATUS = 'Cancelled', updatedOn = now() 
WHERE pprogID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pprog_createProviderProgram` (IN `name` VARCHAR(100), IN `descrip` VARCHAR(100))   BEGIN


INSERT INTO providerProgram (programName, description)
SELECT name, descrip
WHERE NOT EXISTS (SELECT programName, description
FROM providerProgram
WHERE programName = name AND description = descrip) 
LIMIT 1;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pprog_disableProviderProgramAvailabilityByID` (IN `ID` INT)   BEGIN

UPDATE availability SET status = 'Not Available', disabledOn = now() WHERE availID IN(SELECT availID FROM availability WHERE pprogID = ID); 

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pprog_disableProviderProgramByID` (IN `ID` INT)   BEGIN

UPDATE providerProgram SET STATUS = 'Not Available', notAvailOn = now() WHERE pprogID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pprog_enablePProgByID` (IN `ID` INT)   BEGIN 

UPDATE providerProgram SET STATUS = 'Available', updatedOn = now() WHERE pprogID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pprog_getAllAvailedProgram` (IN `pageNo` INT, IN `pageSize` INT, IN `keyword` VARCHAR(50))   BEGIN	

SET pageNo = (pageNo-1)*pageSize;

SELECT trainingProvider.provID, 
providerProgram.pprogID,
providerProgram.programName, 
providerProgram.description, 
trainingProvider.providerName,  
trainingprovider_Program.cost
FROM providerProgram
LEFT JOIN trainingprovider_Program
ON providerProgram.pprogID = trainingprovider_Program.pprogID
LEFT JOIN trainingProvider
ON trainingprovider_Program.provID = trainingProvider.provID
WHERE providerProgram.status = 'Availed'
AND providerProgram.programName 
LIKE (SELECT CONCAT
      ('%', keyword, '%'))
ORDER BY providerProgram.status, 
providerProgram.programName, 
trainingProvider.providerName
LIMIT pageSize OFFSET pageNo;

SELECT COUNT(*)
as "Total"
FROM providerProgram;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pprog_getAllPProg` (IN `pageNo` INT, IN `pageSize` INT, IN `keyword` VARCHAR(50))   BEGIN	

SET pageNo = (pageNo-1)*pageSize;

SELECT pprogID, programName, description, providerProgram.status
FROM providerProgram
WHERE programName 
LIKE (SELECT CONCAT
      ('%', keyword, '%'))
ORDER BY status, programName
LIMIT pageSize OFFSET pageNo;

SELECT COUNT(*)
as "Total"
FROM providerProgram
WHERE programName 
LIKE (SELECT CONCAT
      ('%', keyword, '%'));

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pprog_getAllProviderProgram` (IN `pageNo` INT, IN `pageSize` INT)   BEGIN	

SET pageNo = (pageNo-1)*pageSize;


SELECT * FROM providerProgram 
LIMIT pageSize OFFSET pageNo;

SELECT COUNT(pprogID) AS "total" FROM providerProgram;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pprog_getallTrainingProviderByProgram` (IN `ID` INT)   BEGIN

SELECT trainingProvider.provID, trainingProvider.providerName,
trainingProvider.pointofContact
FROM trainingProvider
LEFT JOIN trainingprovider_Program
ON trainingProvider.provID = trainingprovider_Program.provID
WHERE trainingprovider_Program.pprogID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pprog_getPProgByID` (IN `ID` INT)   BEGIN

DECLARE provID_val varchar(255);

SELECT GROUP_CONCAT(provID) INTO provID_val FROM trainingprovider_program WHERE pprogID = ID;

SELECT programName, Description 
FROM providerprogram 
WHERE pprogID = ID;

SELECT tp.provID, tp.providerName, tp.pointofContact 
FROM trainingprovider AS tp
JOIN trainingprovider_program AS tpp ON tp.provID = tpp.provID
WHERE tpp.pprogID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pprog_getPProgByTPID` (IN `ID` INT)   BEGIN

SELECT * FROM providerProgram WHERE provID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pprog_getProviderProgramByID` (IN `ID` INT)   BEGIN

SELECT * FROM providerProgram WHERE pprogID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pprog_putProvBypprogID` (IN `pprogID_val` INT, IN `provID_val` INT, IN `cost_val` FLOAT(10,0))   BEGIN
DECLARE tpID_val INT;

SELECT tpID INTO tpID_val FROM trainingprovider_program WHERE pprogID = pprogID_val AND provID = provID_val;

IF tpID_val IS NOT NULL THEN
    SELECT 'Already exists' AS result;
ELSE
    INSERT INTO trainingprovider_program (pprogID, provID, cost) VALUES (pprogID_val, provID_val, cost_val);
    SELECT 'Data inserted' AS result;
END IF;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pprog_updatePProgByID` (IN `ID` INT, IN `name` VARCHAR(100), IN `descrip` VARCHAR(100))   BEGIN

UPDATE providerProgram SET programName = name, description = descrip, updatedOn = now() WHERE pprogID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `pprog_updateProviderProgram` (IN `ID` INT, IN `name` VARCHAR(100), IN `descrip` VARCHAR(100))   BEGIN

UPDATE providerProgram SET programName = Name, description = descrip, updatedOn = now() WHERE pprogID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `SMEaffil_createAffiliation` (IN `ID` INT, IN `AorgName` VARCHAR(100), IN `AmemberSince` YEAR, IN `Arole` VARCHAR(50))   BEGIN

INSERT INTO SME_affiliation (profileID, orgName, memberSince, role)
SELECT ID, AorgName, AmemberSince, Arole
WHERE NOT EXISTS (SELECT profileID, orgName, memberSince, role FROM SME_affiliation WHERE profileID = ID AND orgName = AorgName AND memberSince = AmemberSince) LIMIT 1;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `SMEaffil_disableAffiliationByID` (IN `ID` INT)   BEGIN

UPDATE SME_affiliation SET status = 'Inactive' WHERE affilID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `SMEaffil_getAffiliationByID` (IN `ID` INT)   BEGIN

SELECT * FROM SME_affiliation WHERE profileID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `SMEaffil_getAllAffiliationBySME` (IN `ID` INT, IN `pageNo` INT, IN `pageSize` INT, IN `keyword` VARCHAR(100))   BEGIN

SET pageNo = (pageNo-1)*pageSize;

SELECT * FROM SME_affiliation WHERE profileID = ID LIMIT pageSize OFFSET pageNo;

SELECT COUNT(affilID) AS "total" FROM SME_affiliation;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `SMEaffil_updateAffiliationByID` (IN `ID` INT, IN `pID` INT, IN `AorgName` VARCHAR(100), IN `AmemberSince` YEAR, IN `Arole` VARCHAR(50))   BEGIN

UPDATE SME_affiliation SET profileID = pID, orgName = AorgName, memberSince = AmemberSince, role = Arole WHERE affilID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `SMEBE_createSMEBE` (IN `pID` INT(7), IN `deg` ENUM('Undergraduate','Master','Doctor'), IN `prog` VARCHAR(100), IN `startSY` YEAR, IN `endSY` YEAR, IN `stat` ENUM('Completed','On-going','On-hold'))   BEGIN

INSERT INTO SME_educBackground (profileID, degree, program, SYstart, SYend, status) 
SELECT pID, deg, prog, startSY, endSY, stat
WHERE NOT EXISTS (SELECT profileID, degree, program, SYstart, SYend, status FROM SME_educBackground WHERE program = prog AND profileID = pID) LIMIT 1;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `SMEBE_disableSMEBEbyID` (IN `ID` INT)   BEGIN

UPDATE SME_educBackground SET SStatus = 'Inactive' WHERE educID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `SMEBE_disableSMEBEbyProfileID` (IN `ID` INT)   BEGIN

UPDATE SME_educBackground 
SET SStatus = 'Inactive'
WHERE profileID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `SMEBE_enableSMEBEbyID` (IN `ID` INT)   BEGIN

UPDATE SME_educBackground SET SStatus = 'Active' WHERE educID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `SMEBE_getAllSMEBE` (IN `pageNo` INT, IN `pageSize` INT)   BEGIN

SET pageNo = (pageNo-1)*pageSize;

SELECT * FROM SME_educBackground LIMIT pageSize OFFSET pageNo;

SELECT COUNT(educID) AS "total" FROM SME_educBackground;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `SMEBE_getAllSMEBEbyProfileID` (IN `ID` INT)   BEGIN

SELECT * FROM SME_educBackground 
WHERE profileID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `SMEBE_getSMEBEbyID` (IN `ID` INT)   BEGIN

SELECT * FROM SME_educBackground WHERE educID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `SMEBE_updateSMEBEbyID` (IN `ID` INT, IN `deg` ENUM('Undergraduate','Master','Doctor'), IN `prog` VARCHAR(100), IN `startSY` YEAR, IN `endSY` YEAR, IN `stat` ENUM('Completed','On-going','On-hold'))   BEGIN

UPDATE SME_educBackground SET degree = deg, program = prog, SYstart = startSY, SYend = endSY, status = stat WHERE educID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `SME_createSME` (IN `ID` INT(7), IN `lastn` VARCHAR(50), IN `firstn` VARCHAR(50), IN `middlen` VARCHAR(50), IN `mobile` VARCHAR(100), IN `tel` VARCHAR(100), IN `cName` VARCHAR(100), IN `cAddress` VARCHAR(100), IN `cNo` VARCHAR(15), IN `eAddress` VARCHAR(100), IN `fb` VARCHAR(50), IN `viber` VARCHAR(15), IN `web` VARCHAR(100), IN `area` VARCHAR(100), IN `affil` VARCHAR(255), IN `rsrc` ENUM('Internal','External'), IN `rate` DECIMAL(10), IN `taxID` VARCHAR(12))   BEGIN

INSERT INTO SME_expertProfile (provID, lastname, firstname, middlename, mobileNo, telNo, companyName, companyAddress, companyNo, emailAdd, fbMessenger, viberAccount, website, areaOfExpertise, affiliation, resource, honorariaRate, TIN) 
VALUES (ID, lastn, firstn, middlen, mobile, tel, cName, cAddress, cNo, eAddress, fb, viber, web, area, affil, rsrc, rate, taxID);

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `SME_disableSMEbyID` (IN `ID` INT(7))   BEGIN 

UPDATE SME_expertProfile SET status = 'Inactive', disabledOn = now() WHERE profileID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `SME_disableSMEbyTrainingProvider` (IN `ID` INT)   BEGIN

UPDATE SME_expertProfile SET status = 'Inactive', disabledOn = now() WHERE provID = ID; 

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `SME_enableSMEbyID` (IN `ID` INT)   BEGIN 

UPDATE SME_expertProfile SET STATUS = 'Active', updatedOn = now() WHERE profileID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `SME_getAllSME` (IN `pageNo` INT, IN `pageSize` INT, IN `keyword` VARCHAR(50))   BEGIN	

SET pageNo = (pageNo-1)*pageSize;

SELECT * FROM SME_expertProfile 
WHERE
lastname LIKE (SELECT CONCAT('%',keyword,'%'))OR 
firstname LIKE (SELECT CONCAT('%',keyword,'%'))OR 
middlename LIKE (SELECT CONCAT('%',keyword,'%'))OR 
resource LIKE (SELECT CONCAT('%',keyword,'%'))OR 
companyName LIKE (SELECT CONCAT('%',keyword,'%'))OR 
areaOfExpertise LIKE (SELECT CONCAT('%',keyword,'%'))OR 
emailAdd LIKE (SELECT CONCAT('%',keyword,'%'))OR 
mobileNo LIKE (SELECT CONCAT('%',keyword,'%'))OR 
telNo LIKE (SELECT CONCAT('%',keyword,'%'))OR 
status LIKE (SELECT CONCAT('%',keyword,'%')) 
ORDER BY status, createdOn DESC LIMIT pageSize OFFSET pageNo;

SELECT COUNT(profileID) AS "total" FROM SME_expertProfile
WHERE
lastname LIKE (SELECT CONCAT('%',keyword,'%'))OR 
firstname LIKE (SELECT CONCAT('%',keyword,'%'))OR 
middlename LIKE (SELECT CONCAT('%',keyword,'%'))OR 
resource LIKE (SELECT CONCAT('%',keyword,'%'))OR 
companyName LIKE (SELECT CONCAT('%',keyword,'%'))OR 
areaOfExpertise LIKE (SELECT CONCAT('%',keyword,'%'))OR 
emailAdd LIKE (SELECT CONCAT('%',keyword,'%'))OR 
mobileNo LIKE (SELECT CONCAT('%',keyword,'%'))OR 
telNo LIKE (SELECT CONCAT('%',keyword,'%'))OR 
status LIKE (SELECT CONCAT('%',keyword,'%'));

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `SME_getAllSMEbyProgram` (IN `ID` INT)   BEGIN

SELECT * FROM SME_expertProfile WHERE profileID IN (SELECT profileID FROM SME_Program WHERE pprogID = ID);

SELECT COUNT(*) AS "total" FROM SME_expertProfile WHERE profileID IN (SELECT profileID FROM SME_Program WHERE pprogID = ID);


END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `SME_getSMEbyID` (IN `ID` INT)   BEGIN

SELECT * FROM SME_expertProfile WHERE profileID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `SME_getSMEbyProvID` (IN `ID` INT)   BEGIN

SELECT lastname, firstname, middlename, areaOfExpertise
FROM SME_expertProfile WHERE provID = ID;

SELECT COUNT(*)
FROM SME_expertProfile
WHERE provID =ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `SME_updateSMEbyID` (IN `ID` INT(7), IN `lastn` VARCHAR(50), IN `firstn` VARCHAR(50), IN `middlen` VARCHAR(50), IN `tel` VARCHAR(100), IN `mobile` VARCHAR(100), IN `cName` VARCHAR(100), IN `cAddress` VARCHAR(100), IN `cNo` VARCHAR(100), IN `eAddress` VARCHAR(100), IN `fb` VARCHAR(50), IN `viber` VARCHAR(15), IN `web` VARCHAR(100), IN `area` VARCHAR(100), IN `affil` VARCHAR(255), IN `sourcere` ENUM('Internal','External'), IN `rate` DECIMAL(10), IN `taxID` VARCHAR(12))   BEGIN

UPDATE SME_expertProfile SET lastname = lastn, firstname = firstn, middlename = middlen, mobileNo = mobile, telNo = tel, companyName = cName, companyAddress = cAddress, companyNo = cNo, emailAdd = cAddress, fbMessenger = fb, viberAccount = viber, website = web, areaOfExpertise = area, affiliation = affil, resource = sourcere, honorariaRate = rate, TIN = taxID WHERE profileID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `supervisor_certificate_getAllCertificateByEmpIDBySection` (IN `eID` INT, IN `sID` INT)   BEGIN

SELECT db1.certID, db1.programName, db1.description, db1.trainingprovider,
db1.type, db1.startDate, db1.endDate, db1.pdf_content, db1.createdOn
FROM `mirdc2`.`certificates` AS db1
LEFT JOIN `employees`.`employee` AS db2
ON db1.`empID` = db2.`empID`
WHERE db1.`empID` = eID AND db2.`sectionID` = sID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `supervisor_competency_getAllPlannedCompetencyBySection` (IN `ID` INT)   BEGIN

SELECT db1.`ID`, db1.`competency`, db1.`specificLearning`, 
db2.`lastName`, db2.`firstName`, db2.`middleName`, 
db1.`empExistingProficiency`,
db1.`reqProficiency`, db1.`priority`, db1.`ld_intervention`
FROM `cmis`.`competency` AS db1
LEFT JOIN `employees`.`employee` AS db2
ON db1.`empID` = db2.`empID`
LEFT JOIN `employees`.`section` AS db3
ON db2.`sectionID` = db3.`sectionID`
WHERE db3.`sectionID` = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `supervisor_employee_getAllEmployeeBySection` (IN `sID` INT, IN `pageNo` INT, IN `pageSize` INT, IN `keyword` VARCHAR(50))   BEGIN

SET pageNo = (pageNo-1)*pageSize;

SELECT db2.`divisionName`, db2.`divisionChief`,
db3.`sectionName`
FROM `employees`.`section` AS db3
LEFT JOIN `employees`.`division` AS db2
ON db3.`divID` = db2.`divID`
WHERE db3.`sectionID` = sID;

SELECT db1.`empID`, db1.`employeeNo`, db1.`lastName`, db1.`firstName`,
db1.`middleName`, db1.`emailAddress`, db1.`gender`, db1.`position`
FROM `employees`.`employee` AS db1
WHERE (db1.`employeeNo` LIKE CONCAT('%', keyword, '%')
OR db1.`lastName` LIKE CONCAT('%', keyword, '%')
OR db1.`firstName` LIKE CONCAT('%', keyword, '%')
OR db1.`middleName` LIKE CONCAT('%', keyword, '%')
OR db1.`emailAddress` LIKE CONCAT('%', keyword, '%'))
AND db1.`sectionID` = sID
ORDER BY db1.`status`, db1.`createdOn`
LIMIT pageSize OFFSET pageNo;

SELECT COUNT(*) AS "total"
FROM `employees`.`employee` AS db1
WHERE (db1.`employeeNo` LIKE CONCAT('%', keyword, '%')
OR db1.`lastName` LIKE CONCAT('%', keyword, '%')
OR db1.`firstName` LIKE CONCAT('%', keyword, '%')
OR db1.`middleName` LIKE CONCAT('%', keyword, '%')
OR db1.`emailAddress` LIKE CONCAT('%', keyword, '%'))
AND db1.`sectionID` = sID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `supervisor_login` (IN `uName` VARCHAR(255))   BEGIN

SELECT empID, password, role 
FROM users 
WHERE username = uName AND role = 'Supervisor';

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `supervisor_register` (IN `ID` INT(7), IN `uName` VARCHAR(100), IN `pword` VARCHAR(100))   BEGIN

INSERT INTO users (empID, username, password, role)
SELECT ID, uName, pword, 'Supervisor' AS userSupervisor
WHERE NOT EXISTS(SELECT empID, username, password, role 
                 FROM users WHERE username = uName)
LIMIT 1;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `test` (IN `pprogID_val` INT)   BEGIN

DECLARE provID_val INT;

SELECT provID INTO provID_val FROM trainingprovider_program WHERE pprogID = pprogID_val;

SELECT programName, Description 
FROM providerprogram 
WHERE pprogID = pprogID_val;

SELECT tp.providerName, tp.pointofContact 
FROM trainingprovider AS tp
WHERE tp.provID IN (provID_val);

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `tprov_createProgramWithProvider` (IN `tpID` INT, IN `pcost` INT)   BEGIN


INSERT INTO trainingprovider_Program
(provID, pprogID, cost)
SELECT tpID, (SELECT MAX(pprogID) FROM providerProgram), pcost
WHERE NOT EXISTS(
    SELECT provID, pprogID, cost
    FROM trainingprovider_Program
    WHERE provID = tpID
    AND pprogID = (SELECT MAX(pprogID) FROM providerProgram)
    AND cost = pcost
)
LIMIT 1;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `tprov_createTrainingProvider` (IN `Name` VARCHAR(100), IN `POC` VARCHAR(100), IN `addss` VARCHAR(100), IN `web` VARCHAR(100), IN `tel` VARCHAR(255), IN `mobile` VARCHAR(255), IN `email` VARCHAR(100))   BEGIN

INSERT INTO trainingProvider (providerName, pointofContact, address, website, telNo, mobileNo, emailAdd)
SELECT Name, POC, addss, web, tel, mobile, email
WHERE NOT EXISTS(SELECT providerName, pointofContact, address, website, telNo, mobileNo, emailAdd FROM trainingProvider WHERE providerName = Name) LIMIT 1;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `tprov_disableTrainingProviderByID` (IN `ID` INT)   BEGIN 

UPDATE trainingProvider SET STATUS = 'Inactive', disabledOn = now() WHERE provID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `tprov_enableTrainingProviderByID` (IN `ID` INT)   BEGIN 

UPDATE trainingProvider SET status = 'Active', updatedOn = now() WHERE provID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `tprov_getAllTPdd` (IN `pID` INT)   BEGIN

SELECT trainingProvider.provID, trainingProvider.providerName 
FROM trainingProvider
LEFT JOIN trainingprovider_program
ON trainingprovider.provID = trainingprovider_program.provID
WHERE trainingProvider.status ='Active'
AND trainingprovider_program.pprogID = pID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `tprov_getAllTrainingProvider` (IN `pageNo` INT, IN `pageSize` INT, IN `keyword` VARCHAR(50))   BEGIN	

SET pageNo = (pageNo-1)*pageSize;

SELECT * FROM trainingProvider 
WHERE 
providerName LIKE (SELECT CONCAT('%',keyword,'%'))OR 
pointofContact LIKE (SELECT CONCAT('%',keyword,'%'))OR
emailAdd LIKE (SELECT CONCAT('%',keyword,'%'))OR
telNo LIKE (SELECT CONCAT('%',keyword,'%'))OR
mobileNo LIKE (SELECT CONCAT('%',keyword,'%'))
ORDER BY status, provID DESC LIMIT pageSize OFFSET pageNo;

SELECT COUNT(provID) AS "total" FROM trainingProvider;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `tprov_getProgramAvailabilityCostByTrainingProvider` (IN `ID` INT)   BEGIN

SELECT providerProgram.pprogID,
providerProgram.programName, availability.dateFrom, availability.dateTo, availability.fromTime, availability.toTime, trainingprovider_Program.cost
FROM providerProgram
LEFT JOIN availability
ON providerProgram.pprogID = availability.pprogID
LEFT JOIN trainingprovider_Program
ON trainingprovider_Program.pprogID = providerProgram.pprogID
WHERE trainingprovider_Program.provID = ID
ORDER BY providerProgram.programName;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `tprov_getTrainingProviderByID` (IN `ID` VARCHAR(7))   BEGIN

SELECT * FROM trainingProvider WHERE provID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `tprov_search` (IN `keyword` VARCHAR(100))   BEGIN

SELECT * FROM trainingProvider WHERE providerName LIKE (SELECT CONCAT('%',keyword,'%'));

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `tprov_updateTrainingProviderByID` (IN `ID` INT, IN `Name` VARCHAR(100), IN `POC` VARCHAR(100), IN `compAdd` VARCHAR(100), IN `web` VARCHAR(100), IN `tel` VARCHAR(100), IN `mobile` VARCHAR(100), IN `email` VARCHAR(100))   BEGIN

UPDATE trainingProvider SET providerName = Name, pointofContact = POC, address = compAdd, website = web, telNo = tel, mobileNo = mobile, emailAdd = email, updatedOn = now() WHERE provID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `tp_disableProgramsByTrainingProviderID` (IN `ID` INT)   BEGIN

UPDATE providerProgram SET status = 'Not Available', notAvailOn = now() WHERE pprogID IN(SELECT pprogID FROM trainingprovider_Program WHERE provID = ID);

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `tp_getAllProgramsByTrainingProvider` (IN `ID` INT)   BEGIN 

SELECT * FROM providerProgram WHERE pprogID IN (SELECT pprogID FROM trainingprovider_Program WHERE provID = ID);

SELECT COUNT(pprogID)AS "total" FROM providerProgram WHERE pprogID IN(SELECT pprogID FROM trainingprovider_Program WHERE provID = ID);

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `user_login` (IN `uName` VARCHAR(255))   BEGIN

SELECT empID, password, role 
FROM users 
WHERE username = uName AND role = 'User';

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `user_register` (IN `ID` INT, IN `userN` VARCHAR(255), IN `pw` VARCHAR(255))   BEGIN

INSERT INTO users (empID, username, password, role)
SELECT ID, userN, pw, 'User' AS UserUser
WHERE NOT EXISTS(SELECT empID, username, password, role FROM users WHERE username = userN)
LIMIT 1;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `usr_competency_createCompetency` (IN `ID` INT(7), IN `compName` VARCHAR(100), IN `KPI` VARCHAR(255), IN `lvl` ENUM('Low','Medium','High'), IN `target` DATE, IN `remarkss` VARCHAR(255), IN `spec` VARCHAR(255))   BEGIN

UPDATE competencyRequest SET specificLDNeeds = spec WHERE reqID = ID;

INSERT INTO competencies (reqID, competencyName, KPItoSUpport, levelOfPriority, targetDate, remarks)
SELECT ID, compName, KPI, lvl, target, remarkss
WHERE NOT EXISTS (SELECT reqID, competencyName, KPItoSUpport, levelOfPriority, targetDate, remarks FROM competencies WHERE reqID = ID AND competencyName = compName AND competencyRequest.specificLDNeeds = spec) LIMIT 1;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `usr_compReq_createRequest` (IN `ID` INT, IN `spec` VARCHAR(100), IN `lvl` ENUM('Beginner','Intermediate','Advanced'))   BEGIN

INSERT INTO competencyRequest (empID, specificLDNeeds, levelOfProficiency)
SELECT ID, spec, lvl
WHERE NOT EXISTS (SELECT empID, specificLDNeeds, levelOfProficiency FROM competencyRequest WHERE empID = ID AND specificLDNeeds = spec AND levelOfProficiency = lvl) LIMIT 1;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `usr_compReq_getAllApprovedRequest` (IN `pageNo` INT, IN `pageSize` INT, IN `keyword` VARCHAR(50))   BEGIN 

SET pageNo = (pageNo-1)*pageSize;

SELECT specificLDNeeds, levelOfProficiency, reqRemarks, createdOn 
FROM competencyRequest
WHERE specificLDNeeds LIKE (
    SELECT CONCAT(
        '%',keyword,'%'
    )) AND
    
reqStatus = 'Approved'
ORDER BY createdOn DESC
LIMIT pageSize
OFFSET pageNo;

SELECT COUNT(*) 
FROM competencyRequest
WHERE reqStatus = 'Approved';

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `usr_compReq_getAllPendingRequest` (IN `ID` INT, IN `pageNo` INT, IN `pageSize` INT, IN `keyword` VARCHAR(50))   BEGIN 

SET pageNo = (pageNo-1)*pageSize;

SELECT specificLDNeeds, levelOfProficiency,
reqStatus, createdOn 
FROM competencyRequest
WHERE 
empID = ID AND 
specificLDNeeds LIKE (
    SELECT CONCAT(
        '%',keyword,'%'
    )) AND
    
reqStatus = 'For Division Chief Approval'
|| reqStatus = 'For L&D Approval'
ORDER BY reqStatus, createdOn DESC
LIMIT pageSize
OFFSET pageNo;

SELECT COUNT(*) 
FROM competencyRequest
WHERE reqStatus = 'For Division Chief Approval' || reqStatus = 'For L&D Approval';

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `usr_compReq_getAllRejectedRequest` (IN `pageNo` INT, IN `pageSize` INT, IN `keyword` VARCHAR(50))   BEGIN 

SET pageNo = (pageNo-1)*pageSize;

SELECT specificLDNeeds, levelOfProficiency, reqStatus, reqRemarks, createdOn 
FROM competencyRequest
WHERE specificLDNeeds LIKE (
    SELECT CONCAT(
        '%',keyword,'%'
    )) AND
    
reqStatus = 'Rejected by Division Chief' ||
reqStatus = 'Rejected by L&D'
ORDER BY createdOn DESC
LIMIT pageSize
OFFSET pageNo;

SELECT COUNT(*) 
FROM competencyRequest
WHERE reqStatus = 'Rejected by Division Chief' ||
reqStatus = 'Rejected by L&D';

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `usr_compReq_getAllRequestByUser` (IN `ID` INT, IN `pageNo` INT, IN `pageSize` INT, IN `keyword` VARCHAR(50))   BEGIN

SET pageNo =(pageNo-1)*pageSize;

SELECT reqID, specificLDNeeds, levelOfProficiency, createdOn, 
reqStatus, reqRemarks
FROM competencyRequest
WHERE
specificLDNeeds LIKE (SELECT CONCAT('%',keyword,'%')) 
AND empID = ID
ORDER BY reqStatus, createdOn 
DESC LIMIT pageSize OFFSET pageNo;


SELECT COUNT(*) AS "total" FROM competencyRequest
WHERE empID = ID; 


END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `usr_compReq_getRequestByID` (IN `ID` INT)   BEGIN

SELECT employees.lastname, employees.firstname, employees.middlename, competencyRequest.specificLDNeeds, competencyRequest.levelOfProficiency,
competencyRequest.createdOn
FROM competencyRequest
LEFT JOIN employees
ON competencyRequest.empID = employees.empID
WHERE competencyRequest.reqID = ID 
ORDER BY reqStatus, competencyRequest.createdOn DESC;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `usr_compReq_updateRequestStatusByID` (IN `ID` INT)   BEGIN

UPDATE competencyRequest SET competencyRequest.reqStatus = competencies.compStatus 
WHERE competencyRequest.reqID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `usr_scholarship_create` (IN `eID` INT, IN `typ` ENUM('Local','Foreign'), IN `deg` ENUM('Masteral','Doctorate'), IN `FOS` VARCHAR(100), IN `preferred` VARCHAR(100), IN `aYear` YEAR)   BEGIN

INSERT INTO scholarshipRequest (empID, type, degree, fieldOfStudy,
preferredSchool, academicYear, sreqStatus, updatedOn)
SELECT eID, typ, deg, FOS, preferred, aYear,'For Division Chief Approval', now()
WHERE NOT EXISTS (SELECT empID, type,degree, fieldOfStudy,
                  academicYear FROM scholarshipRequest
                  WHERE empID = eID AND type = typ AND degree = deg
                 AND fieldOfStudy = FOS AND academicYear = aYear) LIMIT 1;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `usr_scholarship_getByID` (IN `ID` INT)   BEGIN

SELECT * FROM scholarshipRequest
WHERE sreqID = ID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `usr_scholarship_getByUser` (IN `eID` INT, IN `pageNo` INT, IN `pageSize` INT, IN `keyword` VARCHAR(50))   BEGIN

SET pageNo =(pageNo-1)*pageSize;

SELECT sreqID, type, degree, fieldOfStudy, 
preferredSchool, academicYear,sreqStatus, reqRemarks, createdOn
FROM scholarshipRequest
WHERE fieldOfStudy
LIKE (SELECT CONCAT('%',keyword,'%'))
AND empID = eID ORDER BY createdOn DESC 
LIMIT pageSize OFFSET pageNo;

SELECT COUNT(*) AS "total" FROM scholarshipRequest
WHERE fieldOfStudy
LIKE (SELECT CONCAT('%',keyword,'%'))
AND empID = eID;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `usr_scholarship_withdrawRequestByID` (IN `ID` INT, IN `remarks` VARCHAR(100))   BEGIN

UPDATE scholarshipRequest
SET sreqStatus = 'Withdrawn by requester',
reqRemarks = remarks,
updatedOn = now(), disabledOn = now()
WHERE sreqID =ID;

END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `adminID` int(7) NOT NULL,
  `empID` int(7) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `createdOn` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `disabledOn` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updatedOn` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`adminID`, `empID`, `username`, `password`, `createdOn`, `disabledOn`, `updatedOn`) VALUES
(1, 1, 'admin', '$2b$12$mK9a2AQ1aDVgWE6Vpw77re4VuIfYUX/.DQg8.jmpcN1xrt3dp5o12', '2023-03-28 03:31:22', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(2, 1, 'Administration', '$2b$12$iJIS1iQY2.6OGvDjRUPuNO1AnMiK7PsheN22IzdTSOgjo/Gnqz/A.', '2023-11-17 02:02:11', '0000-00-00 00:00:00', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `aldp`
--

CREATE TABLE `aldp` (
  `aldpYearID` int(7) NOT NULL,
  `aldp_year` year(4) NOT NULL,
  `createdOn` timestamp NOT NULL DEFAULT current_timestamp(),
  `lastModifiedOn` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `aldp`
--

INSERT INTO `aldp` (`aldpYearID`, `aldp_year`, `createdOn`, `lastModifiedOn`) VALUES
(1, '2020', '2023-12-05 22:42:38', '2023-12-05 22:42:38'),
(2, '2021', '2023-12-05 22:43:11', '2023-12-05 22:43:11'),
(4, '2024', '2023-12-05 23:24:43', '2023-12-05 23:24:43'),
(5, '0000', '2023-12-05 23:25:01', '2023-12-20 07:25:56'),
(6, '2023', '2023-12-20 07:30:01', '2023-12-20 07:30:01'),
(7, '2025', '2024-01-16 12:54:30', '2024-01-16 12:54:30'),
(8, '2026', '2024-01-16 12:57:19', '2024-01-16 12:57:19'),
(9, '2030', '2024-01-16 13:11:08', '2024-01-16 13:11:08'),
(10, '2018', '2024-02-06 08:42:25', '2024-02-06 08:42:25'),
(11, '1995', '2024-02-07 02:55:02', '2024-02-07 08:24:35'),
(12, '2000', '2024-02-07 05:20:39', '2024-02-07 05:20:39'),
(13, '1996', '2024-03-01 02:14:12', '2024-03-01 02:14:12');

-- --------------------------------------------------------

--
-- Table structure for table `aldpproposed_competency`
--

CREATE TABLE `aldpproposed_competency` (
  `apcID` int(7) NOT NULL,
  `apID` int(7) NOT NULL,
  `ID` int(7) NOT NULL,
  `createdOn` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `aldpproposed_competency`
--

INSERT INTO `aldpproposed_competency` (`apcID`, `apID`, `ID`, `createdOn`) VALUES
(1, 1, 1, '2024-02-15 09:20:32'),
(4, 3, 2, '2024-02-16 04:20:02'),
(5, 3, 1, '2024-02-16 04:21:47'),
(6, 3, 3, '2024-02-16 04:22:52'),
(7, 13, 2, '2024-03-01 01:54:43'),
(8, 14, 1, '2024-03-01 02:15:57'),
(9, 8, 3, '2024-03-01 02:22:38'),
(10, 13, 2, '2024-03-06 11:39:11'),
(11, 14, 1, '2024-03-06 11:41:31'),
(12, 3, 1, '2024-03-06 12:00:01'),
(13, 3, 3, '2024-03-06 12:05:18'),
(14, 8, 2, '2024-03-06 12:05:37'),
(15, 13, 2, '2024-03-09 09:12:00'),
(16, 3, 1, '2024-03-11 06:38:30'),
(17, 3, 3, '2024-03-11 06:38:38'),
(18, 13, 2, '2024-03-18 06:36:01');

-- --------------------------------------------------------

--
-- Table structure for table `aldp_competency`
--

CREATE TABLE `aldp_competency` (
  `AC_ID` int(7) NOT NULL,
  `aldpID` int(7) NOT NULL,
  `compID` int(7) NOT NULL,
  `type` enum('Internal','External') NOT NULL,
  `numberOfProgram` int(2) DEFAULT NULL,
  `perSession` int(3) DEFAULT NULL,
  `totalPax` int(3) DEFAULT NULL,
  `estimatedCost` int(7) DEFAULT NULL,
  `divParticipants` varchar(255) NOT NULL,
  `possibleProvider` varchar(255) NOT NULL,
  `classification` enum('Technical','Non-Technical') DEFAULT NULL,
  `createdOn` datetime NOT NULL DEFAULT current_timestamp(),
  `lastModified` datetime NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `aldp_proposed`
--

CREATE TABLE `aldp_proposed` (
  `apID` int(7) NOT NULL,
  `tpID` int(7) DEFAULT NULL,
  `competency` varchar(100) NOT NULL,
  `description` varchar(255) NOT NULL,
  `type` enum('Internal','External') NOT NULL,
  `classification` enum('Technical','Non-Technical') NOT NULL,
  `noOfProgram` int(7) DEFAULT NULL,
  `perSession` int(7) DEFAULT NULL,
  `totalPax` int(7) DEFAULT NULL,
  `estimatedCost` float DEFAULT NULL,
  `divisions` varchar(255) DEFAULT NULL,
  `tentative_schedules` date DEFAULT NULL,
  `createdOn` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updatedOn` datetime NOT NULL,
  `aldpStatus` enum('For Approval','Approved') DEFAULT 'For Approval'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `aldp_proposed`
--

INSERT INTO `aldp_proposed` (`apID`, `tpID`, `competency`, `description`, `type`, `classification`, `noOfProgram`, `perSession`, `totalPax`, `estimatedCost`, `divisions`, `tentative_schedules`, `createdOn`, `updatedOn`, `aldpStatus`) VALUES
(1, NULL, 'Artificial Intelligence', '', 'Internal', 'Technical', NULL, NULL, NULL, NULL, NULL, NULL, '2024-04-11 13:44:28', '0000-00-00 00:00:00', 'For Approval'),
(2, 25, 'undefined', '', 'Internal', 'Technical', 0, 0, 0, 0, 'undefined', '2024-04-02', '2024-04-16 08:08:58', '0000-00-00 00:00:00', 'Approved'),
(3, NULL, 'Another Test', '', 'Internal', 'Technical', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-07 07:40:20', '0000-00-00 00:00:00', 'For Approval'),
(4, NULL, 'Test Des', '', 'Internal', 'Technical', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-07 08:01:35', '0000-00-00 00:00:00', 'For Approval'),
(5, NULL, 'Project Management', '', 'Internal', 'Technical', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-07 08:57:37', '0000-00-00 00:00:00', 'For Approval'),
(6, NULL, 'Custom Integration', '', 'Internal', 'Technical', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-07 08:58:49', '0000-00-00 00:00:00', 'For Approval'),
(7, NULL, 'infosec awareness', '', 'Internal', 'Technical', NULL, NULL, NULL, NULL, NULL, NULL, '2024-02-07 09:05:49', '0000-00-00 00:00:00', 'For Approval'),
(8, 13, 'CSWAE', '', 'Internal', 'Technical', 0, 0, 0, 0, 'undefined', '2024-03-31', '2024-04-11 13:45:29', '0000-00-00 00:00:00', 'Approved'),
(9, 13, 'Mama mo', '', 'Internal', 'Technical', 0, 0, 0, 0, 'undefined', '2024-04-02', '2024-04-11 13:45:29', '0000-00-00 00:00:00', 'Approved'),
(10, NULL, 'Kwento mo yan ih', '', 'Internal', 'Technical', 0, 0, 0, 0, 'undefined', '0000-00-00', '2024-04-11 13:44:28', '0000-00-00 00:00:00', 'For Approval'),
(11, NULL, 'kyahhhh', '', 'Internal', 'Technical', 0, 0, 0, 0, 'undefined', '2024-03-17', '2024-04-11 13:44:28', '0000-00-00 00:00:00', 'For Approval'),
(12, 14, 'test competency', 'test desp', 'External', '', 2, 10, 20, 0, 'undefined', '2024-04-10', '2024-04-12 04:52:54', '0000-00-00 00:00:00', 'Approved'),
(13, 14, 'IT Fundamentals', '', 'Internal', 'Technical', 0, 0, 0, 0, 'undefined', '2024-04-02', '2024-04-12 04:53:45', '0000-00-00 00:00:00', 'Approved'),
(14, 13, 'Foreign Language', '', 'Internal', 'Technical', 3, 5, 2, 0, 'undefined', '2024-04-10', '2024-04-12 04:52:54', '0000-00-00 00:00:00', 'Approved');

-- --------------------------------------------------------

--
-- Table structure for table `audit_logs`
--

CREATE TABLE `audit_logs` (
  `auditID` int(7) NOT NULL,
  `username` varchar(255) NOT NULL,
  `target` varchar(255) NOT NULL,
  `action` enum('Create','View','Modify','Deactivate','Reactivate','Upload') DEFAULT NULL,
  `createdOn` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `audit_logs`
--

INSERT INTO `audit_logs` (`auditID`, `username`, `target`, `action`, `createdOn`) VALUES
(4511, 'admin', 'All Training Providers', 'View', '2023-03-30 06:27:39'),
(4512, 'admin', 'Training Provider', 'Create', '2023-03-30 06:28:22'),
(4513, 'admin', 'All Training Providers', 'View', '2023-03-30 06:28:23'),
(4514, 'admin', 'All Training Providers', 'View', '2023-03-30 06:28:57'),
(4515, 'admin', 'All Training Providers', 'View', '2023-03-30 06:28:59'),
(4516, 'admin', 'Subject Matter Expert', 'View', '2023-03-30 06:28:59'),
(4517, 'admin', 'Training Providers', 'View', '2023-03-30 06:29:08'),
(4518, 'admin', 'Training Providers', 'View', '2023-03-30 07:13:52'),
(4519, 'admin', 'Training Providers', 'View', '2023-03-30 07:14:31'),
(4520, 'admin', 'Training Providers', 'View', '2023-03-30 07:31:39'),
(4521, 'admin', 'All Training Providers', 'View', '2023-03-30 07:31:43'),
(4522, 'admin', 'Training Provider', 'Create', '2023-03-30 07:33:03'),
(4523, 'admin', 'All Training Providers', 'View', '2023-03-30 07:33:04'),
(4524, 'admin', 'All Training Providers', 'View', '2023-03-30 07:33:08'),
(4525, 'admin', 'Subject Matter Expert', 'View', '2023-03-30 07:33:08'),
(4526, 'admin', 'Training Providers', 'View', '2023-03-30 07:36:46'),
(4527, 'admin', 'All Training Providers', 'View', '2023-04-08 11:30:12'),
(4528, 'admin', 'All Training Providers', 'View', '2023-04-08 11:30:13'),
(4529, 'admin', 'Subject Matter Expert', 'View', '2023-04-08 11:30:14'),
(4530, 'admin', 'All Training Providers', 'View', '2023-04-08 11:30:43'),
(4531, 'admin', 'All Training Providers', 'View', '2023-04-08 11:30:49'),
(4532, 'admin', 'Subject Matter Expert', 'View', '2023-04-08 11:30:49'),
(4533, 'admin', 'All Training Providers', 'View', '2023-04-08 11:31:04'),
(4534, 'admin', 'All Training Providers', 'View', '2023-04-08 11:31:14'),
(4535, 'admin', 'Subject Matter Expert', 'View', '2023-04-08 11:31:14'),
(4536, 'admin', 'All Training Providers', 'View', '2023-04-08 11:31:18'),
(4537, 'admin', 'All Training Providers', 'View', '2023-04-08 11:31:21'),
(4538, 'admin', 'Subject Matter Expert', 'View', '2023-04-08 11:31:21'),
(4539, 'admin', 'All Training Providers', 'View', '2023-04-08 11:34:00'),
(4540, 'admin', 'All Training Providers', 'View', '2023-04-08 11:34:06'),
(4541, 'admin', 'All Training Providers', 'View', '2023-04-08 11:34:14'),
(4542, 'admin', 'Subject Matter Expert', 'View', '2023-04-08 11:34:14'),
(4543, 'admin', 'All Training Providers', 'View', '2023-04-08 11:34:19'),
(4544, 'admin', 'All Training Providers', 'View', '2023-04-08 11:34:20'),
(4545, 'admin', 'Subject Matter Expert', 'View', '2023-04-08 11:34:20'),
(4546, 'admin', 'All Training Providers', 'View', '2023-04-08 11:35:24'),
(4547, 'admin', 'All Training Providers', 'View', '2023-04-08 11:35:27'),
(4548, 'admin', 'Subject Matter Expert', 'View', '2023-04-08 11:35:27'),
(4549, 'admin', 'All Training Providers', 'View', '2023-04-08 11:35:40'),
(4550, 'admin', 'All Training Providers', 'View', '2023-04-08 11:35:45'),
(4551, 'admin', 'Subject Matter Expert', 'View', '2023-04-08 11:35:45'),
(4552, 'admin', 'All Training Providers', 'View', '2023-04-08 11:36:36'),
(4553, 'admin', 'All Training Providers', 'View', '2023-04-08 11:36:40'),
(4554, 'admin', 'Subject Matter Expert', 'View', '2023-04-08 11:36:41'),
(4555, 'admin', 'All Training Providers', 'View', '2023-04-08 11:37:14'),
(4556, 'admin', 'All Training Providers', 'View', '2023-04-08 11:37:16'),
(4557, 'admin', 'Subject Matter Expert', 'View', '2023-04-08 11:37:16'),
(4558, 'admin', 'All Training Providers', 'View', '2023-04-08 11:37:20'),
(4559, 'admin', 'All Training Providers', 'View', '2023-04-08 11:37:23'),
(4560, 'admin', 'Subject Matter Expert', 'View', '2023-04-08 11:37:24'),
(4561, 'admin', 'All Training Providers', 'View', '2023-04-08 11:37:53'),
(4562, 'admin', 'All Training Providers', 'View', '2023-04-08 11:37:57'),
(4563, 'admin', 'Subject Matter Expert', 'View', '2023-04-08 11:37:57'),
(4564, 'admin', 'Training Providers', 'View', '2023-04-08 11:48:33'),
(4565, 'admin', 'All Training Providers', 'View', '2023-04-08 11:48:54'),
(4566, 'admin', 'All Training Providers', 'View', '2023-04-08 11:48:57'),
(4567, 'admin', 'Subject Matter Expert', 'View', '2023-04-08 11:48:57'),
(4568, 'admin', 'Training Providers', 'View', '2023-04-08 11:49:05'),
(4569, 'admin', 'All Training Providers', 'View', '2023-04-10 09:00:43'),
(4570, 'admin', 'All Training Providers', 'View', '2023-04-10 09:00:48'),
(4571, 'admin', 'Subject Matter Expert', 'View', '2023-04-10 09:00:48'),
(4572, 'admin', 'Training Providers', 'View', '2023-04-10 10:01:15'),
(4573, 'admin', 'All Training Providers', 'View', '2023-04-11 03:17:27'),
(4574, 'admin', 'All Training Providers', 'View', '2023-04-11 03:27:26'),
(4575, 'admin', 'All Training Providers', 'View', '2023-04-11 03:28:14'),
(4576, 'admin', 'All Training Providers', 'View', '2023-04-11 03:28:47'),
(4577, 'sample_user', 'All Requested Comptency', 'View', '2023-09-28 12:54:07'),
(4578, 'sample_user', 'All Requested Comptency', 'View', '2023-09-28 12:54:16'),
(4579, 'sample_user', 'All Requested Comptency', 'View', '2023-09-28 12:54:47'),
(4580, 'sample_user', 'All Requested Comptency', 'View', '2023-09-28 12:55:05'),
(4581, 'sample_user', 'All Planned Competency', 'View', '2023-10-06 04:33:56'),
(4582, 'sample_user', 'All Planned Competency', 'View', '2023-10-06 04:34:25'),
(4583, 'sample_user', 'All Certificates', 'View', '2023-10-06 04:43:52'),
(4584, 'sample_user', 'All Planned Competency', 'View', '2023-10-06 05:03:48'),
(4585, 'sample_user', 'All Certificates', 'View', '2023-10-06 05:09:21'),
(4586, 'sample_user', 'All Certificates', 'View', '2023-10-06 05:09:31'),
(4587, 'sample_user', 'All Certificates', 'View', '2023-10-06 05:10:24'),
(4588, 'sample_user', 'All Certificates', 'View', '2023-10-06 05:10:27'),
(4589, 'sample_user', 'All Certificates', 'View', '2023-10-06 05:10:55'),
(4590, 'sample_user', 'All Certificates', 'View', '2023-10-06 05:11:56'),
(4591, 'sample_user', 'All Certificates', 'View', '2023-10-06 05:12:24'),
(4592, 'sample_user', 'All Certificates', 'View', '2023-10-06 05:14:35'),
(4593, 'sample_user', 'All Certificates', 'View', '2023-10-06 05:15:59'),
(4594, 'sample_user', 'All Certificates', 'View', '2023-10-06 05:16:48'),
(4595, 'sample_user', 'All Certificates', 'View', '2023-10-06 05:18:31'),
(4596, 'sample_user', 'All Certificates', 'View', '2023-10-06 05:22:01'),
(4597, 'sample_user', 'User scholarship request', 'View', '2023-10-06 05:22:04'),
(4598, 'sample_user', 'User scholarship request', 'View', '2023-10-06 05:22:04'),
(4599, 'sample_user', 'User scholarship request', 'View', '2023-10-06 05:22:04'),
(4600, 'sample_user', 'User scholarship request', 'View', '2023-10-06 05:22:04'),
(4601, 'sample_user', 'All Certificates', 'View', '2023-10-06 05:22:06'),
(4602, 'sample_user', 'All Certificates', 'View', '2023-10-06 05:22:55'),
(4603, 'sample_user', 'All Certificates', 'View', '2023-10-06 05:24:08'),
(4604, 'sample_user', 'All Certificates', 'View', '2023-10-06 05:24:45'),
(4605, 'sample_user', 'All Certificates', 'View', '2023-10-06 05:25:06'),
(4606, 'sample_user', 'All Certificates', 'View', '2023-10-06 05:25:21'),
(4607, 'sample_user', 'All Certificates', 'View', '2023-10-06 05:26:02'),
(4608, 'sample_user', 'All Certificates', 'View', '2023-10-06 05:26:15'),
(4609, 'sample_user', 'All Certificates', 'View', '2023-10-06 05:26:44'),
(4610, 'sample_user', 'User scholarship request', 'View', '2023-10-06 05:26:50'),
(4611, 'sample_user', 'User scholarship request', 'View', '2023-10-06 05:26:50'),
(4612, 'sample_user', 'User scholarship request', 'View', '2023-10-06 05:26:50'),
(4613, 'sample_user', 'User scholarship request', 'View', '2023-10-06 05:26:50'),
(4614, 'sample_user', 'All Certificates', 'View', '2023-10-06 05:26:53'),
(4615, 'sample_user', 'All Certificates', 'View', '2023-10-06 05:29:43'),
(4616, 'sample_user', 'All Certificates', 'View', '2023-10-06 05:32:01'),
(4617, 'sample_user', 'User scholarship request', 'View', '2023-10-06 05:32:13'),
(4618, 'sample_user', 'User scholarship request', 'View', '2023-10-06 05:32:13'),
(4619, 'sample_user', 'User scholarship request', 'View', '2023-10-06 05:32:13'),
(4620, 'sample_user', 'User scholarship request', 'View', '2023-10-06 05:32:13'),
(4621, 'sample_user', 'All Certificates', 'View', '2023-10-06 05:32:15'),
(4622, 'sample_user', 'User scholarship request', 'View', '2023-10-06 05:32:22'),
(4623, 'sample_user', 'User scholarship request', 'View', '2023-10-06 05:32:23'),
(4624, 'sample_user', 'User scholarship request', 'View', '2023-10-06 05:32:23'),
(4625, 'sample_user', 'User scholarship request', 'View', '2023-10-06 05:32:23'),
(4626, 'sample_user', 'All Certificates', 'View', '2023-10-06 05:32:36'),
(4627, 'sample_user', 'User scholarship request', 'View', '2023-10-06 05:49:27'),
(4628, 'sample_user', 'User scholarship request', 'View', '2023-10-06 05:49:27'),
(4629, 'sample_user', 'User scholarship request', 'View', '2023-10-06 05:49:27'),
(4630, 'sample_user', 'User scholarship request', 'View', '2023-10-06 05:49:27'),
(4631, 'sample_user', 'All Certificates', 'View', '2023-10-06 05:49:35'),
(4632, 'sample_user', 'User scholarship request', 'View', '2023-10-06 06:13:35'),
(4633, 'sample_user', 'User scholarship request', 'View', '2023-10-06 06:13:35'),
(4634, 'sample_user', 'User scholarship request', 'View', '2023-10-06 06:13:35'),
(4635, 'sample_user', 'User scholarship request', 'View', '2023-10-06 06:13:35'),
(4636, 'sample_user', 'All Certificates', 'View', '2023-10-06 06:13:37'),
(4637, 'sample_user', 'All Certificates', 'View', '2023-10-06 06:13:56'),
(4638, 'sample_user', 'All Planned Competency', 'View', '2023-10-06 06:14:48'),
(4639, 'sample_user', 'All Planned Competency', 'View', '2023-10-06 06:15:58'),
(4640, 'sample_user', 'All Planned Competency', 'View', '2023-10-06 06:16:08'),
(4641, 'sample_user', 'All Planned Competency', 'View', '2023-10-06 06:17:55'),
(4642, 'sample_user', 'All Planned Competency', 'View', '2023-10-06 06:21:17'),
(4643, 'sample_user', 'All Planned Competency', 'View', '2023-10-06 06:22:11'),
(4644, 'sample_user', 'All Planned Competency', 'View', '2023-10-06 06:22:32'),
(4645, 'sample_user', 'All Planned Competency', 'View', '2023-10-06 06:23:41'),
(4646, 'sample_user', 'All Planned Competency', 'View', '2023-10-06 06:25:50'),
(4647, 'sample_user', 'All Planned Competency', 'View', '2023-10-06 06:26:08'),
(4648, 'sample_user', 'All Planned Competency', 'View', '2023-10-06 06:32:24'),
(4649, 'sample_user', 'All Planned Competency', 'View', '2023-10-06 06:35:49'),
(4650, 'sample_user', 'All Planned Competency', 'View', '2023-10-06 06:35:57'),
(4651, 'sample_user', 'All Planned Competency', 'View', '2023-10-06 06:36:16'),
(4652, 'sample_user', 'All Planned Competency', 'View', '2023-10-06 06:36:32'),
(4653, 'sample_user', 'All Planned Competency', 'View', '2023-10-06 06:37:06'),
(4654, 'sample_user', 'All Planned Competency', 'View', '2023-10-06 06:37:29'),
(4655, 'sample_user', 'All Planned Competency', 'View', '2023-10-06 06:39:22'),
(4656, 'sample_user', 'All Planned Competency', 'View', '2023-10-06 06:39:29'),
(4657, 'sample_user', 'All Planned Competency', 'View', '2023-10-06 06:46:14'),
(4658, 'supervisor2', 'All Certificates', 'View', '2023-11-06 03:08:16'),
(4659, 'sample_user', 'All Planned Competency', 'View', '2023-11-07 02:11:44'),
(4660, 'sample_user', 'All Planned Competency', 'View', '2023-11-07 02:13:04'),
(4661, 'sample_user', 'All Planned Competency', 'View', '2023-11-07 02:13:29'),
(4662, 'sample_user', 'All Planned Competency', 'View', '2023-11-07 02:19:55'),
(4663, 'sample_user', 'All Planned Competency', 'View', '2023-11-07 04:12:26'),
(4664, 'sample_user', 'All Planned Competency', 'View', '2023-11-07 04:12:26'),
(4665, 'sample_user', 'All Certificates', 'View', '2023-11-07 04:12:35'),
(4666, 'sample_user', 'All Planned Competency', 'View', '2023-11-07 04:12:43'),
(4667, 'sample_user', 'All Planned Competency', 'View', '2023-11-07 04:12:43'),
(4668, 'sample_user', 'All Planned Competency', 'View', '2023-11-07 04:18:16'),
(4669, 'sample_user', 'All Planned Competency', 'View', '2023-11-07 04:18:16'),
(4670, 'sample_user', 'All Planned Competency', 'View', '2023-11-07 04:18:24'),
(4671, 'sample_user', 'All Planned Competency', 'View', '2023-11-07 04:18:24'),
(4672, 'sample_user', 'All Planned Competency', 'View', '2023-11-07 04:23:04'),
(4673, 'sample_user', 'All Planned Competency', 'View', '2023-11-07 04:23:04'),
(4674, 'sample_user', 'All Planned Competency', 'View', '2023-11-07 04:24:13'),
(4675, 'sample_user', 'All Planned Competency', 'View', '2023-11-07 04:24:13'),
(4676, 'sample_user', 'All Planned Competency', 'View', '2023-11-07 04:24:45'),
(4677, 'sample_user', 'All Planned Competency', 'View', '2023-11-07 04:25:22'),
(4678, 'sample_user', 'All Planned Competency', 'View', '2023-11-07 04:25:22'),
(4679, 'sample_user', 'All Planned Competency', 'View', '2023-11-07 04:25:22'),
(4680, 'sample_user', 'All Planned Competency', 'View', '2023-11-07 04:25:31'),
(4681, 'sample_user', 'All Planned Competency', 'View', '2023-11-07 04:25:31'),
(4682, 'sample_user', 'All Planned Competency', 'View', '2023-11-07 04:25:31'),
(4683, 'sample_user', 'All Certificates', 'View', '2023-11-07 04:26:11'),
(4684, 'sample_user', 'All Certificates', 'View', '2023-11-07 04:26:15'),
(4685, 'sample_user', 'All Certificates', 'View', '2023-11-07 04:26:17'),
(4686, 'sample_user', 'All Certificates', 'View', '2023-11-07 04:26:23'),
(4687, 'sample_user', 'All Certificates', 'View', '2023-11-07 04:26:27'),
(4688, 'sample_user', 'All Certificates', 'View', '2023-11-07 04:27:11'),
(4689, 'sample_user', 'All Certificates', 'View', '2023-11-07 04:27:19'),
(4690, 'sample_user', 'All Planned Competency', 'View', '2023-11-07 04:28:18'),
(4691, 'sample_user', 'All Planned Competency', 'View', '2023-11-07 04:28:18'),
(4692, 'sample_user', 'All Planned Competency', 'View', '2023-11-07 04:28:18'),
(4693, 'sample_user', 'All Planned Competency', 'View', '2023-11-07 04:32:00'),
(4694, 'sample_user', 'All Planned Competency', 'View', '2023-11-07 04:32:00'),
(4695, 'sample_user', 'All Planned Competency', 'View', '2023-11-07 04:32:00'),
(4696, 'sample_user', 'All Planned Competency', 'View', '2023-11-07 04:32:27'),
(4697, 'sample_user', 'All Planned Competency', 'View', '2023-11-07 04:32:27'),
(4698, 'sample_user', 'All Planned Competency', 'View', '2023-11-07 04:32:27'),
(4699, 'supervisor2', 'All sections competency.', 'View', '2023-11-07 04:32:48'),
(4700, 'sample_user', 'All Planned Competency', 'View', '2023-11-07 04:34:45'),
(4701, 'sample_user', 'All Planned Competency', 'View', '2023-11-07 04:34:45'),
(4702, 'sample_user', 'All Planned Competency', 'View', '2023-11-07 04:34:45'),
(4703, 'sample_user', 'All Planned Competency', 'View', '2023-11-07 04:34:58'),
(4704, 'sample_user', 'All Planned Competency', 'View', '2023-11-07 04:34:58'),
(4705, 'sample_user', 'All Planned Competency', 'View', '2023-11-07 04:34:58'),
(4706, 'supervisor2', 'All sections competency.', 'View', '2023-11-07 04:34:58'),
(4707, 'sample_user', 'All Planned Competency', 'View', '2023-11-07 04:35:14'),
(4708, 'sample_user', 'All Planned Competency', 'View', '2023-11-07 04:35:14'),
(4709, 'sample_user', 'All Planned Competency', 'View', '2023-11-07 04:35:14'),
(4710, 'sample_user', 'All Planned Competency', 'View', '2023-11-07 04:35:27'),
(4711, 'sample_user', 'All Planned Competency', 'View', '2023-11-07 04:35:27'),
(4712, 'sample_user', 'All Planned Competency', 'View', '2023-11-07 04:35:27'),
(4713, 'sample_user', 'All Certificates', 'View', '2023-11-07 04:35:35'),
(4714, 'sample_user', 'All Certificates', 'View', '2023-11-07 04:35:39'),
(4715, 'supervisor2', 'All Planned Competency', 'View', '2023-11-07 04:36:31'),
(4716, 'supervisor2', 'All Planned Competency', 'View', '2023-11-07 04:37:16'),
(4717, 'supervisor2', 'All Planned Competency', 'View', '2023-11-07 04:37:24'),
(4718, 'supervisor2', 'All Planned Competency', 'View', '2023-11-07 04:38:05'),
(4719, 'sample_user', 'All Certificates', 'View', '2023-11-07 04:39:24'),
(4720, 'sample_user', 'All Planned Competency', 'View', '2023-11-07 04:39:28'),
(4721, 'sample_user', 'All Planned Competency', 'View', '2023-11-07 04:39:28'),
(4722, 'sample_user', 'All Planned Competency', 'View', '2023-11-07 04:39:28'),
(4723, 'sample_user', 'All Planned Competency', 'View', '2023-11-07 04:39:51'),
(4724, 'sample_user', 'All Planned Competency', 'View', '2023-11-07 04:39:51'),
(4725, 'sample_user', 'All Planned Competency', 'View', '2023-11-07 04:39:51'),
(4726, 'sample_user', 'All Planned Competency', 'View', '2023-11-07 04:39:54'),
(4727, 'sample_user', 'All Planned Competency', 'View', '2023-11-07 04:39:54'),
(4728, 'sample_user', 'All Planned Competency', 'View', '2023-11-07 04:39:54'),
(4729, 'sample_user', 'All Planned Competency', 'View', '2023-11-07 04:39:54'),
(4730, 'sample_user', 'All Planned Competency', 'View', '2023-11-07 04:39:54'),
(4731, 'sample_user', 'All Planned Competency', 'View', '2023-11-07 04:39:54'),
(4732, 'sample_user', 'All Planned Competency', 'View', '2023-11-07 04:40:46'),
(4733, 'sample_user', 'All Planned Competency', 'View', '2023-11-07 04:40:46'),
(4734, 'sample_user', 'All Planned Competency', 'View', '2023-11-07 04:40:46'),
(4735, 'sample_user', 'All Certificates', 'View', '2023-11-07 04:41:27'),
(4736, 'supervisor2', 'All Planned Competency', 'View', '2023-11-07 04:46:38'),
(4737, 'supervisor2', 'All Planned Competency', 'View', '2023-11-07 04:46:46'),
(4738, 'sample_user', 'All Planned Competency', 'View', '2023-11-07 04:50:27'),
(4739, 'sample_user', 'All Planned Competency', 'View', '2023-11-07 04:50:27'),
(4740, 'sample_user', 'All Planned Competency', 'View', '2023-11-07 04:50:27'),
(4741, 'divChief', 'All sections competency.', 'View', '2023-11-07 04:54:49'),
(4742, 'supervisor2', 'All Planned Competency', 'View', '2023-11-07 04:54:58'),
(4743, 'divChief', 'All Planned Competency', 'View', '2023-11-07 04:56:03'),
(4744, 'divChief', 'All Planned Competency', 'View', '2023-11-07 04:56:37'),
(4745, 'divChief', 'All Planned Competency', 'View', '2023-11-07 04:57:05'),
(4746, 'divChief', 'All Planned Competency', 'View', '2023-11-07 04:57:10'),
(4747, 'supervisor2', 'All Planned Competency', 'View', '2023-11-07 04:57:24'),
(4748, 'supervisor2', 'All Planned Competency', 'View', '2023-11-07 05:03:37'),
(4749, 'supervisor2', 'All Planned Competency', 'View', '2023-11-07 05:03:43'),
(4750, 'supervisor2', 'All Planned Competency', 'View', '2023-11-07 05:06:34'),
(4751, 'sample_user', 'All Certificates', 'View', '2023-11-07 05:06:35'),
(4752, 'supervisor2', 'All Planned Competency', 'View', '2023-11-07 05:07:45'),
(4753, 'supervisor2', 'All Planned Competency', 'View', '2023-11-07 05:08:01'),
(4754, 'supervisor2', 'All Planned Competency', 'View', '2023-11-07 05:08:28'),
(4755, 'supervisor2', 'All Planned Competency', 'View', '2023-11-07 05:10:10'),
(4756, 'sample_user', 'User scholarship request', 'View', '2023-11-07 05:11:21'),
(4757, 'sample_user', 'User scholarship request', 'View', '2023-11-07 05:11:21'),
(4758, 'sample_user', 'User scholarship request', 'View', '2023-11-07 05:11:21'),
(4759, 'sample_user', 'User scholarship request', 'View', '2023-11-07 05:11:21'),
(4760, 'sample_user', 'All Certificates', 'View', '2023-11-07 05:11:24'),
(4761, 'sample_user', 'User scholarship request', 'View', '2023-11-07 05:11:38'),
(4762, 'sample_user', 'User scholarship request', 'View', '2023-11-07 05:11:38'),
(4763, 'sample_user', 'User scholarship request', 'View', '2023-11-07 05:11:38'),
(4764, 'sample_user', 'User scholarship request', 'View', '2023-11-07 05:11:38'),
(4765, 'sample_user', 'All Certificates', 'View', '2023-11-07 05:11:51'),
(4766, 'sample_user', 'All Planned Competency', 'View', '2023-11-07 05:12:47'),
(4767, 'sample_user', 'All Planned Competency', 'View', '2023-11-07 05:12:47'),
(4768, 'sample_user', 'All Planned Competency', 'View', '2023-11-07 05:12:47'),
(4769, 'sample_user', 'All Certificates', 'View', '2023-11-07 05:12:53'),
(4770, 'supervisor2', 'All Planned Competency', 'View', '2023-11-07 05:14:13'),
(4771, 'supervisor2', 'All Planned Competency', 'View', '2023-11-07 05:16:01'),
(4772, 'sample_user', 'User scholarship request', 'View', '2023-11-07 05:23:04'),
(4773, 'sample_user', 'User scholarship request', 'View', '2023-11-07 05:23:04'),
(4774, 'sample_user', 'User scholarship request', 'View', '2023-11-07 05:23:04'),
(4775, 'sample_user', 'User scholarship request', 'View', '2023-11-07 05:23:04'),
(4776, 'sample_user', 'All Certificates', 'View', '2023-11-07 05:23:08'),
(4777, 'sample_user', 'User scholarship request', 'View', '2023-11-07 05:23:10'),
(4778, 'sample_user', 'User scholarship request', 'View', '2023-11-07 05:23:10'),
(4779, 'sample_user', 'User scholarship request', 'View', '2023-11-07 05:23:10'),
(4780, 'sample_user', 'User scholarship request', 'View', '2023-11-07 05:23:10'),
(4781, 'sample_user', 'All Certificates', 'View', '2023-11-07 05:23:14'),
(4782, 'sample_user', 'User scholarship request', 'View', '2023-11-07 05:23:20'),
(4783, 'sample_user', 'User scholarship request', 'View', '2023-11-07 05:23:20'),
(4784, 'sample_user', 'User scholarship request', 'View', '2023-11-07 05:23:20'),
(4785, 'sample_user', 'User scholarship request', 'View', '2023-11-07 05:23:20'),
(4786, 'sample_user', 'All Certificates', 'View', '2023-11-07 05:26:50'),
(4787, 'sample_user', 'All Certificates', 'View', '2023-11-07 05:28:54'),
(4788, 'Administration', 'All Training Providers', 'View', '2023-11-17 02:02:43'),
(4789, 'Administration', 'All Training Providers', 'View', '2023-11-17 02:02:47'),
(4790, 'Administration', 'Subject Matter Expert', 'View', '2023-11-17 02:02:47'),
(4791, 'Administration', 'All Training Providers', 'View', '2023-11-17 02:02:55'),
(4792, 'Administration', 'All Training Providers', 'View', '2023-11-17 02:03:12'),
(4793, 'Administration', 'All Training Providers', 'View', '2023-11-17 02:04:29'),
(4794, 'Administration', 'All Training Providers', 'View', '2023-11-17 02:04:30'),
(4795, 'Administration', 'Subject Matter Expert', 'View', '2023-11-17 02:04:30'),
(4796, 'Administration', 'Subject Matter Expert', 'View', '2023-11-17 02:22:09'),
(4797, 'Administration', 'All Training Providers', 'View', '2023-11-17 02:23:43'),
(4798, 'Administration', 'All Training Providers', 'View', '2023-11-17 02:23:44'),
(4799, 'Administration', 'Subject Matter Expert', 'View', '2023-11-17 02:23:44'),
(4800, 'Administration', 'Subject Matter Expert', 'View', '2023-11-17 02:23:53'),
(4801, 'Administration', 'All Training Providers', 'View', '2023-11-17 02:43:25'),
(4802, 'Administration', 'All Training Providers', 'View', '2023-11-17 02:43:27'),
(4803, 'Administration', 'Subject Matter Expert', 'View', '2023-11-17 02:43:27'),
(4804, 'Administration', 'All Training Providers', 'View', '2023-11-17 03:04:30'),
(4805, 'Administration', 'All Training Providers', 'View', '2023-11-17 03:25:24'),
(4806, 'Administration', 'All Training Providers', 'View', '2023-11-17 03:25:24'),
(4807, 'Administration', 'All Training Providers', 'View', '2023-11-17 03:25:24'),
(4808, 'Administration', 'All Training Providers', 'View', '2023-11-17 03:25:24'),
(4809, 'Administration', 'All Training Providers', 'View', '2023-11-17 03:25:30'),
(4810, 'Administration', 'All Training Providers', 'View', '2023-11-17 03:25:36'),
(4811, 'Administration', 'Subject Matter Expert', 'View', '2023-11-17 03:25:51'),
(4812, 'Administration', 'All Training Providers', 'View', '2023-11-17 03:26:07'),
(4813, 'Administration', 'All Training Providers', 'View', '2023-11-17 03:26:07'),
(4814, 'Administration', 'All Training Providers', 'View', '2023-11-17 03:26:07'),
(4815, 'Administration', 'All Training Providers', 'View', '2023-11-17 03:26:07'),
(4816, 'Administration', 'All Training Providers', 'View', '2023-11-17 03:26:08'),
(4817, 'Administration', 'All Training Providers', 'View', '2023-11-17 03:26:08'),
(4818, 'Administration', 'All Training Providers', 'View', '2023-11-17 03:26:08'),
(4819, 'Administration', 'All Training Providers', 'View', '2023-11-17 03:26:08'),
(4820, 'Administration', 'All Training Providers', 'View', '2023-11-17 05:57:55'),
(4821, 'Administration', 'All Training Providers', 'View', '2023-11-17 05:57:58'),
(4822, 'Administration', 'Subject Matter Expert', 'View', '2023-11-17 05:57:58'),
(4823, 'Administration', 'All Training Providers', 'View', '2023-11-17 06:08:48'),
(4824, 'Administration', 'All Training Providers', 'View', '2023-11-17 06:08:51'),
(4825, 'Administration', 'Subject Matter Expert', 'View', '2023-11-17 06:08:51'),
(4826, 'Administration', 'All Training Providers', 'View', '2023-11-17 06:11:47'),
(4827, 'Administration', 'All Training Providers', 'View', '2023-11-17 06:12:24'),
(4828, 'Administration', 'All Training Providers', 'View', '2023-11-17 06:12:47'),
(4829, 'Administration', 'All Training Providers', 'View', '2023-11-17 06:23:58'),
(4830, 'Administration', 'All Training Providers', 'View', '2023-11-17 06:24:48'),
(4831, 'Administration', 'Subject Matter Expert', 'View', '2023-11-17 06:24:48'),
(4832, 'Administration', 'All Training Providers', 'View', '2023-11-17 06:24:50'),
(4833, 'Administration', 'All Training Providers', 'View', '2023-11-17 06:25:12'),
(4834, 'Administration', 'Subject Matter Expert', 'View', '2023-11-17 06:25:12'),
(4835, 'Administration', 'All Training Providers', 'View', '2023-11-17 06:25:40'),
(4836, 'Administration', 'All Training Providers', 'View', '2023-11-17 06:28:01'),
(4837, 'Administration', 'All Request for Local Scholarship', 'View', '2023-11-17 06:43:54'),
(4838, 'Administration', 'All Request for Foreign Scholarship', 'View', '2023-11-17 06:43:54'),
(4839, 'sample_user', 'All Planned Competency', 'View', '2023-11-17 07:01:39'),
(4840, 'sample_user', 'All Planned Competency', 'View', '2023-11-17 07:01:39'),
(4841, 'sample_user', 'All Planned Competency', 'View', '2023-11-17 07:01:39'),
(4842, 'sample_user', 'All Certificates', 'View', '2023-11-17 07:02:16'),
(4843, 'sample_user', 'User scholarship request', 'View', '2023-11-17 07:02:19'),
(4844, 'sample_user', 'User scholarship request', 'View', '2023-11-17 07:02:19'),
(4845, 'sample_user', 'User scholarship request', 'View', '2023-11-17 07:02:19'),
(4846, 'sample_user', 'User scholarship request', 'View', '2023-11-17 07:02:19'),
(4847, 'sample_user', 'All Certificates', 'View', '2023-11-17 07:02:47'),
(4848, 'sample_user', 'User scholarship request', 'View', '2023-11-17 07:02:48'),
(4849, 'sample_user', 'User scholarship request', 'View', '2023-11-17 07:02:48'),
(4850, 'sample_user', 'User scholarship request', 'View', '2023-11-17 07:02:48'),
(4851, 'sample_user', 'User scholarship request', 'View', '2023-11-17 07:02:48'),
(4852, 'sample_user', 'All Certificates', 'View', '2023-11-17 07:02:50'),
(4853, 'sample_user', 'User scholarship request', 'View', '2023-11-17 07:02:52'),
(4854, 'sample_user', 'User scholarship request', 'View', '2023-11-17 07:02:52'),
(4855, 'sample_user', 'User scholarship request', 'View', '2023-11-17 07:02:52'),
(4856, 'sample_user', 'User scholarship request', 'View', '2023-11-17 07:02:52'),
(4857, 'sample_user', 'All Certificates', 'View', '2023-11-17 07:02:54'),
(4858, 'sample_user', 'User scholarship request', 'View', '2023-11-17 07:02:57'),
(4859, 'sample_user', 'User scholarship request', 'View', '2023-11-17 07:02:57'),
(4860, 'sample_user', 'User scholarship request', 'View', '2023-11-17 07:02:57'),
(4861, 'sample_user', 'User scholarship request', 'View', '2023-11-17 07:02:57'),
(4862, 'sample_user', 'All Certificates', 'View', '2023-11-17 07:02:58'),
(4863, 'sample_user', 'All Certificates', 'View', '2023-11-17 07:03:30'),
(4864, 'sample_user', 'User scholarship request', 'View', '2023-11-17 07:03:32'),
(4865, 'sample_user', 'User scholarship request', 'View', '2023-11-17 07:03:32'),
(4866, 'sample_user', 'User scholarship request', 'View', '2023-11-17 07:03:32'),
(4867, 'sample_user', 'User scholarship request', 'View', '2023-11-17 07:03:32'),
(4868, 'sample_user', 'All Certificates', 'View', '2023-11-17 07:03:39'),
(4869, 'sample_user', 'User scholarship request', 'View', '2023-11-17 07:03:41'),
(4870, 'sample_user', 'User scholarship request', 'View', '2023-11-17 07:03:41'),
(4871, 'sample_user', 'User scholarship request', 'View', '2023-11-17 07:03:42'),
(4872, 'sample_user', 'User scholarship request', 'View', '2023-11-17 07:03:42'),
(4873, 'sample_user', 'All Certificates', 'View', '2023-11-17 07:03:57'),
(4874, 'sample_user', 'User scholarship request', 'View', '2023-11-17 07:05:20'),
(4875, 'sample_user', 'User scholarship request', 'View', '2023-11-17 07:05:20'),
(4876, 'sample_user', 'User scholarship request', 'View', '2023-11-17 07:05:20'),
(4877, 'sample_user', 'User scholarship request', 'View', '2023-11-17 07:05:20'),
(4878, 'sample_user', 'All Certificates', 'View', '2023-11-17 07:05:28'),
(4879, 'sample_user', 'All Planned Competency', 'View', '2023-11-17 07:05:32'),
(4880, 'sample_user', 'All Planned Competency', 'View', '2023-11-17 07:05:32'),
(4881, 'sample_user', 'All Planned Competency', 'View', '2023-11-17 07:05:32'),
(4882, 'sample_user', 'All Planned Competency', 'View', '2023-11-17 07:08:38'),
(4883, 'sample_user', 'All Planned Competency', 'View', '2023-11-17 07:08:38'),
(4884, 'sample_user', 'All Planned Competency', 'View', '2023-11-17 07:08:38'),
(4885, 'sample_user', 'All Planned Competency', 'View', '2023-11-17 07:08:43'),
(4886, 'sample_user', 'All Planned Competency', 'View', '2023-11-17 07:08:43'),
(4887, 'sample_user', 'All Planned Competency', 'View', '2023-11-17 07:08:43'),
(4888, 'sample_user', 'All Planned Competency', 'View', '2023-11-17 07:14:59'),
(4889, 'sample_user', 'All Planned Competency', 'View', '2023-11-17 07:14:59'),
(4890, 'sample_user', 'All Planned Competency', 'View', '2023-11-17 07:14:59'),
(4891, 'sample_user', 'All Planned Competency', 'View', '2023-11-17 07:15:31'),
(4892, 'sample_user', 'All Planned Competency', 'View', '2023-11-17 07:15:31'),
(4893, 'sample_user', 'All Planned Competency', 'View', '2023-11-17 07:15:31'),
(4894, 'sample_user', 'All Certificates', 'View', '2023-11-17 07:15:44'),
(4895, 'sample_user', 'User scholarship request', 'View', '2023-11-17 07:15:45'),
(4896, 'sample_user', 'User scholarship request', 'View', '2023-11-17 07:15:45'),
(4897, 'sample_user', 'User scholarship request', 'View', '2023-11-17 07:15:45'),
(4898, 'sample_user', 'User scholarship request', 'View', '2023-11-17 07:15:45'),
(4899, 'sample_user', 'All Certificates', 'View', '2023-11-17 07:16:19'),
(4900, 'sample_user', 'All Planned Competency', 'View', '2023-11-17 07:16:21'),
(4901, 'sample_user', 'All Planned Competency', 'View', '2023-11-17 07:16:21'),
(4902, 'sample_user', 'All Planned Competency', 'View', '2023-11-17 07:16:21'),
(4903, 'sample_user', 'All Planned Competency', 'View', '2023-11-17 07:17:20'),
(4904, 'sample_user', 'All Planned Competency', 'View', '2023-11-17 07:17:20'),
(4905, 'sample_user', 'All Planned Competency', 'View', '2023-11-17 07:17:20'),
(4906, 'sample_user', 'All Planned Competency', 'View', '2023-11-17 07:17:42'),
(4907, 'sample_user', 'All Planned Competency', 'View', '2023-11-17 07:17:42'),
(4908, 'sample_user', 'All Planned Competency', 'View', '2023-11-17 07:17:42'),
(4909, 'sample_user', 'All Planned Competency', 'View', '2023-11-17 07:19:34'),
(4910, 'sample_user', 'All Planned Competency', 'View', '2023-11-17 07:19:34'),
(4911, 'sample_user', 'All Planned Competency', 'View', '2023-11-17 07:19:34'),
(4912, 'sample_user', 'All Planned Competency', 'View', '2023-11-17 07:20:24'),
(4913, 'sample_user', 'All Planned Competency', 'View', '2023-11-17 07:20:24'),
(4914, 'sample_user', 'All Planned Competency', 'View', '2023-11-17 07:20:24'),
(4915, 'sample_user', 'All Planned Competency', 'View', '2023-11-17 07:22:32'),
(4916, 'sample_user', 'All Planned Competency', 'View', '2023-11-17 07:22:32'),
(4917, 'sample_user', 'All Planned Competency', 'View', '2023-11-17 07:22:32'),
(4918, 'sample_user', 'All Planned Competency', 'View', '2023-11-17 07:22:49'),
(4919, 'sample_user', 'All Planned Competency', 'View', '2023-11-17 07:22:49'),
(4920, 'sample_user', 'All Planned Competency', 'View', '2023-11-17 07:22:49'),
(4921, 'Administration', 'All Training Providers', 'View', '2023-11-17 07:23:06'),
(4922, 'sample_user', 'All Planned Competency', 'View', '2023-11-17 07:24:02'),
(4923, 'sample_user', 'All Planned Competency', 'View', '2023-11-17 07:24:02'),
(4924, 'sample_user', 'All Planned Competency', 'View', '2023-11-17 07:24:02'),
(4925, 'sample_user', 'All Certificates', 'View', '2023-11-17 07:24:10'),
(4926, 'sample_user', 'User scholarship request', 'View', '2023-11-17 07:24:11'),
(4927, 'sample_user', 'User scholarship request', 'View', '2023-11-17 07:24:11'),
(4928, 'sample_user', 'User scholarship request', 'View', '2023-11-17 07:24:11'),
(4929, 'sample_user', 'User scholarship request', 'View', '2023-11-17 07:24:11'),
(4930, 'sample_user', 'All Certificates', 'View', '2023-11-17 07:24:18'),
(4931, 'sample_user', 'All Certificates', 'View', '2023-11-17 07:25:18'),
(4932, 'sample_user', 'User scholarship request', 'View', '2023-11-17 07:25:20'),
(4933, 'sample_user', 'User scholarship request', 'View', '2023-11-17 07:25:20'),
(4934, 'sample_user', 'User scholarship request', 'View', '2023-11-17 07:25:20'),
(4935, 'sample_user', 'User scholarship request', 'View', '2023-11-17 07:25:20'),
(4936, 'sample_user', 'All Certificates', 'View', '2023-11-17 07:28:29'),
(4937, 'sample_user', 'All Planned Competency', 'View', '2023-11-17 07:28:30'),
(4938, 'sample_user', 'All Planned Competency', 'View', '2023-11-17 07:28:30'),
(4939, 'sample_user', 'All Planned Competency', 'View', '2023-11-17 07:28:30'),
(4940, 'Administration', 'All Training Providers', 'View', '2023-11-17 07:29:17'),
(4941, 'Administration', 'All Training Providers', 'View', '2023-11-17 07:29:39'),
(4942, 'Administration', 'Subject Matter Expert', 'View', '2023-11-17 07:29:39'),
(4943, 'Administration', 'All Request for Foreign Scholarship', 'View', '2023-11-17 07:32:25'),
(4944, 'Administration', 'All Request for Local Scholarship', 'View', '2023-11-17 07:32:25'),
(4945, 'sample_user', 'All Planned Competency', 'View', '2023-11-17 07:32:25'),
(4946, 'sample_user', 'All Planned Competency', 'View', '2023-11-17 07:32:25'),
(4947, 'sample_user', 'All Planned Competency', 'View', '2023-11-17 07:32:25'),
(4948, 'sample_user', 'All Planned Competency', 'View', '2023-11-17 07:33:46'),
(4949, 'sample_user', 'All Planned Competency', 'View', '2023-11-17 07:33:46'),
(4950, 'sample_user', 'All Planned Competency', 'View', '2023-11-17 07:33:46'),
(4951, 'sample_user', 'All Planned Competency', 'View', '2023-11-17 07:41:42'),
(4952, 'sample_user', 'All Planned Competency', 'View', '2023-11-17 07:41:42'),
(4953, 'sample_user', 'All Planned Competency', 'View', '2023-11-17 07:41:42'),
(4954, 'sample_user', 'All Certificates', 'View', '2023-11-17 07:42:14'),
(4955, 'sample_user', 'All Planned Competency', 'View', '2023-11-17 07:42:18'),
(4956, 'sample_user', 'All Planned Competency', 'View', '2023-11-17 07:42:18'),
(4957, 'sample_user', 'All Planned Competency', 'View', '2023-11-17 07:42:18'),
(4958, 'sample_user', 'All Planned Competency', 'View', '2023-11-17 07:45:11'),
(4959, 'sample_user', 'All Planned Competency', 'View', '2023-11-17 07:45:11'),
(4960, 'sample_user', 'All Planned Competency', 'View', '2023-11-17 07:45:11'),
(4961, 'Administration', 'Training Providers', 'View', '2023-11-23 08:45:00'),
(4962, 'Administration', 'Subject Matter Expert', 'View', '2023-11-23 08:45:03'),
(4963, 'Administration', 'Training Providers', 'View', '2023-11-23 08:45:05'),
(4964, 'Administration', 'Subject Matter Expert', 'Create', '2023-11-23 08:46:31'),
(4965, 'Administration', 'Subject Matter Expert', 'View', '2023-11-23 08:46:31'),
(4966, 'Administration', 'Subject Matter Expert', 'View', '2023-11-23 08:47:25'),
(4967, 'Administration', 'Subject Matter Expert', 'View', '2023-11-23 08:47:34'),
(4968, 'Administration', 'Training Providers', 'View', '2023-11-23 08:47:35'),
(4969, 'Administration', 'Subject Matter Expert', 'View', '2023-11-23 08:47:40'),
(4970, 'Administration', 'Subject Matter Expert', 'View', '2023-11-23 08:47:41'),
(4971, 'Administration', 'Subject Matter Expert', 'View', '2023-11-23 08:47:48'),
(4972, 'Administration', 'Subject Matter Expert', 'Modify', '2023-11-23 08:47:54'),
(4973, 'Administration', 'Subject Matter Expert', 'View', '2023-11-23 08:47:55'),
(4974, 'Administration', 'Subject Matter Expert', 'Deactivate', '2023-11-23 08:47:59'),
(4975, 'Administration', 'Subject Matter Expert', 'View', '2023-11-23 08:47:59'),
(4976, 'Administration', 'Subject Matter Expert', 'View', '2023-11-23 08:48:02'),
(4977, 'Administration', 'All Training Providers', 'View', '2023-11-23 08:48:10'),
(4978, 'Administration', 'All Training Providers', 'View', '2023-11-23 08:48:11'),
(4979, 'Administration', 'Subject Matter Expert', 'View', '2023-11-23 08:48:11'),
(4980, 'Administration', 'All Training Providers', 'View', '2023-11-23 08:48:37'),
(4981, 'Administration', 'All Training Providers', 'View', '2023-11-23 08:48:44'),
(4982, 'Administration', 'Subject Matter Expert', 'View', '2023-11-23 08:48:44'),
(4983, 'Administration', 'All Training Providers', 'View', '2023-11-23 09:48:49'),
(4984, 'Administration', 'All Training Providers', 'View', '2023-11-23 09:48:49'),
(4985, 'Administration', 'All Training Providers', 'View', '2023-11-23 09:48:49'),
(4986, 'Administration', 'All Training Providers', 'View', '2023-11-23 09:48:49'),
(4987, 'Administration', 'Subject Matter Expert', 'View', '2023-11-23 09:49:04'),
(4988, 'Administration', 'All Training Providers', 'View', '2023-11-23 09:49:15'),
(4989, 'Administration', 'All Training Providers', 'View', '2023-11-23 09:49:15'),
(4990, 'Administration', 'All Training Providers', 'View', '2023-11-23 09:49:15'),
(4991, 'Administration', 'All Training Providers', 'View', '2023-11-23 09:49:15'),
(4992, 'Administration', 'All Training Providers', 'View', '2023-11-23 21:44:24'),
(4993, 'Administration', 'All Training Providers', 'View', '2023-11-23 21:44:26'),
(4994, 'Administration', 'Subject Matter Expert', 'View', '2023-11-23 21:44:26'),
(4995, 'Administration', 'All Training Providers', 'View', '2023-11-23 21:44:34'),
(4996, 'Administration', 'All Training Providers', 'View', '2023-11-23 21:44:34'),
(4997, 'Administration', 'All Training Providers', 'View', '2023-11-23 21:44:34'),
(4998, 'Administration', 'All Training Providers', 'View', '2023-11-23 21:44:34'),
(4999, 'Administration', 'Get All Request', 'View', '2023-11-24 01:39:21'),
(5000, 'Administration', 'Get All Request', 'View', '2023-11-24 01:40:11'),
(5001, 'Administration', 'All Training Providers', 'View', '2023-11-24 02:08:56'),
(5002, 'Administration', 'All Training Providers', 'View', '2023-11-24 02:12:56'),
(5003, 'sample_user', 'All Planned Competency', 'View', '2023-11-24 02:13:23'),
(5004, 'sample_user', 'All Planned Competency', 'View', '2023-11-24 02:13:23'),
(5005, 'sample_user', 'All Planned Competency', 'View', '2023-11-24 02:13:23'),
(5006, 'Administration', 'All Training Providers', 'View', '2023-11-24 02:16:24'),
(5007, 'Administration', 'All Training Providers', 'View', '2023-11-24 02:16:44'),
(5008, 'Administration', 'Subject Matter Expert', 'View', '2023-11-24 02:17:03'),
(5009, 'Administration', 'All Training Providers', 'View', '2023-11-24 02:17:08'),
(5010, 'Administration', 'All Training Providers', 'View', '2023-11-24 02:18:35'),
(5011, 'Administration', 'Subject Matter Expert', 'View', '2023-11-24 02:18:45'),
(5012, 'Administration', 'Subject Matter Expert', 'View', '2023-11-24 02:19:16'),
(5013, 'Administration', 'All Request for Local Scholarship', 'View', '2023-11-24 02:23:07'),
(5014, 'Administration', 'All Request for Foreign Scholarship', 'View', '2023-11-24 02:23:07'),
(5015, 'Administration', 'All Request for Local Scholarship', 'View', '2023-11-24 02:23:52'),
(5016, 'Administration', 'All Request for Foreign Scholarship', 'View', '2023-11-24 02:23:52'),
(5017, 'Administration', 'Subject Matter Expert', 'View', '2023-11-24 02:40:06'),
(5018, 'Administration', 'All Training Providers', 'View', '2023-11-24 02:42:39'),
(5019, 'Administration', 'Subject Matter Expert', 'View', '2023-11-24 02:52:15'),
(5020, 'Administration', 'Subject Matter Expert', 'View', '2023-11-24 02:52:20'),
(5021, 'Administration', 'Subject Matter Expert', 'View', '2023-11-24 02:52:25'),
(5022, 'Administration', 'Subject Matter Expert', 'View', '2023-11-24 02:52:49'),
(5023, 'Administration', 'Subject Matter Expert', 'View', '2023-11-24 02:52:53'),
(5024, 'Administration', 'Subject Matter Expert', 'View', '2023-11-24 02:52:56'),
(5025, 'Administration', 'Subject Matter Expert', 'View', '2023-11-24 02:53:31'),
(5026, 'Administration', 'All Training Providers', 'View', '2023-11-24 02:54:08'),
(5027, 'Administration', 'All Training Providers', 'View', '2023-11-24 02:54:10'),
(5028, 'Administration', 'All Training Providers', 'View', '2023-11-24 02:55:52'),
(5029, 'Administration', 'All Training Providers', 'View', '2023-11-24 02:56:42'),
(5030, 'Administration', 'All Training Providers', 'View', '2023-11-24 02:56:50'),
(5031, 'Administration', 'Subject Matter Expert', 'View', '2023-11-24 02:56:54'),
(5032, 'Administration', 'Subject Matter Expert', 'View', '2023-11-24 02:56:57'),
(5033, 'Administration', 'Subject Matter Expert', 'View', '2023-11-24 02:58:54'),
(5034, 'Administration', 'All Training Providers', 'View', '2023-11-24 03:09:00'),
(5035, 'Administration', 'All Training Providers', 'View', '2023-11-24 03:09:12'),
(5036, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5037, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5038, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5039, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5040, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5041, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5042, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5043, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5044, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5045, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5046, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5047, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5048, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5049, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5050, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5051, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5052, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5053, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5054, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5055, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5056, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5057, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5058, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5059, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5060, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5061, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5062, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5063, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5064, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5065, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5066, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5067, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5068, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5069, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5070, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5071, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5072, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5073, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5074, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5075, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5076, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5077, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5078, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5079, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5080, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5081, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5082, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5083, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5084, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5085, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5086, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5087, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5088, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5089, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5090, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5091, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5092, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5093, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5094, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5095, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5096, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5097, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5098, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5099, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5100, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5101, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5102, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5103, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5104, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5105, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5106, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5107, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5108, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5109, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5110, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5111, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5112, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5113, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5114, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5115, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5116, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5117, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5118, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5119, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5120, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5121, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5122, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5123, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5124, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5125, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5126, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5127, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5128, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5129, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5130, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5131, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5132, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5133, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5134, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5135, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5136, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5137, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5138, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5139, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5140, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5141, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5142, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5143, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5144, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5145, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5146, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5147, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5148, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5149, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5150, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5151, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5152, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5153, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32');
INSERT INTO `audit_logs` (`auditID`, `username`, `target`, `action`, `createdOn`) VALUES
(5154, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5155, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5156, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5157, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5158, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5159, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5160, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5161, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5162, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5163, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5164, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5165, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5166, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5167, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5168, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5169, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5170, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5171, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5172, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5173, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5174, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5175, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:32'),
(5176, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5177, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5178, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5179, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5180, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5181, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5182, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5183, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5184, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5185, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5186, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5187, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5188, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5189, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5190, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5191, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5192, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5193, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5194, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5195, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5196, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5197, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5198, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5199, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5200, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5201, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5202, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5203, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5204, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5205, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5206, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5207, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5208, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5209, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5210, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5211, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5212, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5213, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5214, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5215, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5216, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5217, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5218, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5219, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5220, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5221, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5222, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5223, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5224, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5225, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5226, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5227, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5228, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5229, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5230, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5231, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5232, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5233, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5234, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5235, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5236, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5237, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5238, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5239, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5240, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5241, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5242, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5243, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5244, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5245, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5246, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5247, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5248, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5249, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5250, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5251, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5252, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5253, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5254, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5255, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5256, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5257, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5258, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5259, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5260, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5261, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5262, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5263, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5264, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5265, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:09:33'),
(5266, 'Administration', 'All Training Providers', 'View', '2023-11-24 03:09:33'),
(5267, 'Administration', 'Training Provider', 'Create', '2023-11-24 03:10:31'),
(5268, 'Administration', 'All Training Providers', 'View', '2023-11-24 03:10:31'),
(5269, 'Administration', 'All Training Providers', 'View', '2023-11-24 03:10:41'),
(5270, 'Administration', 'All Training Providers', 'View', '2023-11-24 03:10:46'),
(5271, 'Administration', 'All Request for Local Scholarship', 'View', '2023-11-24 03:16:07'),
(5272, 'Administration', 'All Request for Foreign Scholarship', 'View', '2023-11-24 03:16:07'),
(5273, 'Administration', 'All Request for Local Scholarship', 'View', '2023-11-24 03:18:37'),
(5274, 'Administration', 'All Request for Foreign Scholarship', 'View', '2023-11-24 03:18:37'),
(5275, 'Administration', 'All Request for Local Scholarship', 'View', '2023-11-24 03:18:55'),
(5276, 'Administration', 'All Request for Foreign Scholarship', 'View', '2023-11-24 03:18:55'),
(5277, 'Administration', 'All Request for Local Scholarship', 'View', '2023-11-24 03:19:51'),
(5278, 'Administration', 'All Request for Foreign Scholarship', 'View', '2023-11-24 03:19:51'),
(5279, 'Administration', 'All Request for Local Scholarship', 'View', '2023-11-24 03:20:18'),
(5280, 'Administration', 'All Request for Foreign Scholarship', 'View', '2023-11-24 03:20:18'),
(5281, 'Administration', 'All Request for Local Scholarship', 'View', '2023-11-24 03:20:34'),
(5282, 'Administration', 'All Request for Foreign Scholarship', 'View', '2023-11-24 03:20:34'),
(5283, 'Administration', 'All Training Providers', 'View', '2023-11-24 03:20:53'),
(5284, 'Administration', 'All Training Providers', 'View', '2023-11-24 03:20:57'),
(5285, 'Administration', 'All Training Providers', 'View', '2023-11-24 03:20:59'),
(5286, 'Administration', 'All Training Providers', 'View', '2023-11-24 03:21:24'),
(5287, 'Administration', 'All Request for Local Scholarship', 'View', '2023-11-24 03:23:51'),
(5288, 'Administration', 'All Request for Foreign Scholarship', 'View', '2023-11-24 03:23:51'),
(5289, 'Administration', 'All Training Providers', 'View', '2023-11-24 03:35:37'),
(5290, 'Administration', 'All Training Providers', 'View', '2023-11-24 03:40:27'),
(5291, 'Administration', 'All Training Providers', 'View', '2023-11-24 03:40:34'),
(5292, 'Administration', 'All Training Providers', 'View', '2023-11-24 03:41:00'),
(5293, 'Administration', 'All Training Providers', 'View', '2023-11-24 03:43:41'),
(5294, 'Administration', 'All Training Providers', 'View', '2023-11-24 03:44:04'),
(5295, 'Administration', 'All Training Providers', 'View', '2023-11-24 03:44:30'),
(5296, 'Administration', 'All Training Providers', 'View', '2023-11-24 03:45:31'),
(5297, 'Administration', 'All Training Providers', 'View', '2023-11-24 03:48:18'),
(5298, 'Administration', 'All Training Providers', 'View', '2023-11-24 03:48:23'),
(5299, 'Administration', 'All Training Providers', 'View', '2023-11-24 03:49:32'),
(5300, 'Administration', 'All Training Providers', 'View', '2023-11-24 03:50:09'),
(5301, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5302, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5303, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5304, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5305, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5306, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5307, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5308, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5309, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5310, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5311, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5312, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5313, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5314, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5315, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5316, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5317, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5318, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5319, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5320, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5321, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5322, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5323, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5324, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5325, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5326, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5327, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5328, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5329, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5330, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5331, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5332, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5333, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5334, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5335, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5336, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5337, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5338, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5339, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5340, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5341, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5342, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5343, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5344, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5345, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5346, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5347, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5348, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5349, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5350, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5351, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5352, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5353, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5354, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5355, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5356, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5357, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5358, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5359, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5360, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5361, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5362, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5363, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5364, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5365, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5366, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5367, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5368, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5369, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5370, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5371, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5372, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5373, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5374, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5375, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5376, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5377, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5378, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5379, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5380, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5381, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5382, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5383, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5384, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5385, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5386, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5387, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5388, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5389, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5390, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5391, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5392, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5393, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5394, 'Administration', 'Training Provider', 'Upload', '2023-11-24 03:50:24'),
(5395, 'Administration', 'All Training Providers', 'View', '2023-11-24 03:50:24'),
(5396, 'Administration', 'All Training Providers', 'View', '2023-11-24 03:51:22'),
(5397, 'Administration', 'All Training Providers', 'View', '2023-11-24 03:51:42'),
(5398, 'Administration', 'All Training Providers', 'View', '2023-11-24 03:51:50'),
(5399, 'Administration', 'All Training Providers', 'View', '2023-11-24 03:52:04'),
(5400, 'Administration', 'All Training Providers', 'View', '2023-11-24 03:52:40'),
(5401, 'Administration', 'All Training Providers', 'View', '2023-11-24 03:54:25'),
(5402, 'Administration', 'All Training Providers', 'View', '2023-11-24 03:54:36'),
(5403, 'Administration', 'All Training Providers', 'View', '2023-11-24 03:54:55'),
(5404, 'Administration', 'All Training Providers', 'View', '2023-11-24 03:56:19'),
(5405, 'Administration', 'All Training Providers', 'View', '2023-11-24 03:56:32'),
(5406, 'Administration', 'All Training Providers', 'View', '2023-11-24 03:56:45'),
(5407, 'Administration', 'All Training Providers', 'View', '2023-11-24 03:58:24'),
(5408, 'Administration', 'All Training Providers', 'View', '2023-11-24 03:59:48'),
(5409, 'Administration', 'All Training Providers', 'View', '2023-11-24 03:59:54'),
(5410, 'Administration', 'All Training Providers', 'View', '2023-11-24 04:01:11'),
(5411, 'Administration', 'All Training Providers', 'View', '2023-11-24 04:01:34'),
(5412, 'Administration', 'All Training Providers', 'View', '2023-11-24 04:02:03'),
(5413, 'Administration', 'Subject Matter Expert', 'View', '2023-11-24 04:02:08'),
(5414, 'Administration', 'Training Providers', 'View', '2023-11-24 04:02:15'),
(5415, 'Administration', 'Subject Matter Expert', 'View', '2023-11-24 04:02:19'),
(5416, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5417, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5418, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5419, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5420, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5421, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5422, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5423, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5424, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5425, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5426, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5427, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5428, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5429, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5430, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5431, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5432, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5433, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5434, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5435, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5436, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5437, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5438, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5439, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5440, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5441, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5442, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5443, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5444, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5445, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5446, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5447, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5448, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5449, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5450, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5451, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5452, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5453, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5454, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5455, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5456, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5457, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5458, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5459, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5460, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5461, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5462, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5463, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5464, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5465, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5466, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5467, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5468, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5469, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5470, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5471, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5472, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5473, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5474, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5475, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5476, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5477, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5478, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5479, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5480, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5481, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5482, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5483, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5484, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5485, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5486, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5487, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5488, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5489, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5490, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5491, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5492, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5493, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5494, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5495, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5496, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5497, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5498, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5499, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5500, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5501, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5502, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5503, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5504, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5505, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5506, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5507, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5508, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5509, 'Administration', 'Subject Matter Expert', 'Upload', '2023-11-24 04:02:29'),
(5510, 'Administration', 'All Request for Local Scholarship', 'View', '2023-11-24 05:04:47'),
(5511, 'Administration', 'All Request for Foreign Scholarship', 'View', '2023-11-24 05:04:47'),
(5512, 'Administration', 'All Training Providers', 'View', '2023-11-24 05:19:36'),
(5513, 'Administration', 'All Training Providers', 'View', '2023-11-24 05:19:38'),
(5514, 'Administration', 'Subject Matter Expert', 'View', '2023-11-24 05:19:38'),
(5515, 'Administration', 'All Training Providers', 'View', '2023-11-24 05:19:45'),
(5516, 'Administration', 'All Training Providers', 'View', '2023-11-24 05:22:58'),
(5517, 'Administration', 'Subject Matter Expert', 'View', '2023-11-24 05:22:58'),
(5518, 'Administration', 'All Training Providers', 'View', '2023-11-24 05:23:06'),
(5519, 'Administration', 'All Training Providers', 'View', '2023-11-24 05:23:10'),
(5520, 'Administration', 'Subject Matter Expert', 'View', '2023-11-24 05:23:10'),
(5521, 'Administration', 'All Training Providers', 'View', '2023-11-24 05:23:13'),
(5522, 'Administration', 'All Training Providers', 'View', '2023-11-24 05:23:31'),
(5523, 'Administration', 'Subject Matter Expert', 'View', '2023-11-24 05:23:31'),
(5524, 'Administration', 'All Training Providers', 'View', '2023-11-24 05:23:51'),
(5525, 'Administration', 'All Training Providers', 'View', '2023-11-24 05:24:48'),
(5526, 'Administration', 'All Training Providers', 'View', '2023-11-24 05:24:51'),
(5527, 'Administration', 'Subject Matter Expert', 'View', '2023-11-24 05:24:51'),
(5528, 'Administration', 'All Training Providers', 'View', '2023-11-24 05:24:54'),
(5529, 'Administration', 'All Training Providers', 'View', '2023-11-24 05:24:55'),
(5530, 'Administration', 'Subject Matter Expert', 'View', '2023-11-24 05:24:55'),
(5531, 'Administration', 'All Training Providers', 'View', '2023-11-24 05:24:57'),
(5532, 'Administration', 'Subject Matter Expert', 'View', '2023-11-24 05:24:58'),
(5533, 'Administration', 'All Training Providers', 'View', '2023-11-24 05:24:58'),
(5534, 'Administration', 'All Training Providers', 'View', '2023-11-24 05:24:59'),
(5535, 'Administration', 'All Training Providers', 'View', '2023-11-24 05:25:00'),
(5536, 'Administration', 'Subject Matter Expert', 'View', '2023-11-24 05:25:00'),
(5537, 'Administration', 'All Training Providers', 'View', '2023-11-24 05:25:11'),
(5538, 'Administration', 'All Training Providers', 'View', '2023-11-24 05:25:11'),
(5539, 'Administration', 'All Training Providers', 'View', '2023-11-24 05:25:40'),
(5540, 'Administration', 'All Training Providers', 'View', '2023-11-24 05:27:10'),
(5541, 'Administration', 'All Training Providers', 'View', '2023-11-24 05:27:10'),
(5542, 'Administration', 'All Training Providers', 'View', '2023-11-24 05:27:13'),
(5543, 'Administration', 'All Training Providers', 'View', '2023-11-24 05:27:36'),
(5544, 'Administration', 'All Training Providers', 'View', '2023-11-24 05:27:36'),
(5545, 'Administration', 'All Training Providers', 'View', '2023-11-24 05:27:37'),
(5546, 'Administration', 'All Training Providers', 'View', '2023-11-24 05:27:44'),
(5547, 'Administration', 'All Training Providers', 'View', '2023-11-24 05:27:44'),
(5548, 'Administration', 'All Training Providers', 'View', '2023-11-24 05:27:45'),
(5549, 'Administration', 'All Training Providers', 'View', '2023-11-24 05:28:03'),
(5550, 'Administration', 'All Training Providers', 'View', '2023-11-24 05:28:03'),
(5551, 'Administration', 'All Training Providers', 'View', '2023-11-24 05:28:05'),
(5552, 'Administration', 'All Training Providers', 'View', '2023-11-24 05:29:20'),
(5553, 'Administration', 'Subject Matter Expert', 'View', '2023-11-24 05:29:25'),
(5554, 'Administration', 'All Training Providers', 'View', '2023-11-24 05:29:25'),
(5555, 'Administration', 'All Training Providers', 'View', '2023-11-24 05:29:30'),
(5556, 'Administration', 'All Training Providers', 'View', '2023-11-24 05:29:30'),
(5557, 'Administration', 'All Training Providers', 'View', '2023-11-24 05:29:34'),
(5558, 'Administration', 'Training Provider', 'Deactivate', '2023-11-24 05:29:37'),
(5559, 'Administration', 'All Training Providers', 'View', '2023-11-24 05:29:37'),
(5560, 'Administration', 'All Training Providers', 'View', '2023-11-24 05:29:42'),
(5561, 'Administration', 'Subject Matter Expert', 'View', '2023-11-24 05:29:42'),
(5562, 'Administration', 'Training Providers', 'Reactivate', '2023-11-24 05:29:43'),
(5563, 'Administration', 'All Training Providers', 'View', '2023-11-24 05:29:43'),
(5564, 'Administration', 'All Training Providers', 'View', '2023-11-24 05:29:54'),
(5565, 'Administration', 'Subject Matter Expert', 'View', '2023-11-24 05:29:54'),
(5566, 'Administration', 'All Training Providers', 'View', '2023-11-24 05:30:58'),
(5567, 'Administration', 'All Training Providers', 'View', '2023-11-24 05:31:47'),
(5568, 'Administration', 'Subject Matter Expert', 'View', '2023-11-24 05:31:47'),
(5569, 'Administration', 'All Training Providers', 'View', '2023-11-24 05:32:25'),
(5570, 'Administration', 'All Training Providers', 'View', '2023-11-24 05:32:27'),
(5571, 'Administration', 'Subject Matter Expert', 'View', '2023-11-24 05:32:27'),
(5572, 'Administration', 'All Training Providers', 'View', '2023-11-24 05:32:43'),
(5573, 'Administration', 'Subject Matter Expert', 'View', '2023-11-24 05:32:46'),
(5574, 'Administration', 'All Training Providers', 'View', '2023-11-24 05:32:46'),
(5575, 'Administration', 'All Training Providers', 'View', '2023-11-24 05:32:59'),
(5576, 'Administration', 'All Training Providers', 'View', '2023-11-24 05:33:03'),
(5577, 'Administration', 'Subject Matter Expert', 'View', '2023-11-24 05:33:03'),
(5578, 'Administration', 'All Training Providers', 'View', '2023-11-24 05:33:06'),
(5579, 'Administration', 'All Training Providers', 'View', '2023-11-24 05:33:07'),
(5580, 'Administration', 'Subject Matter Expert', 'View', '2023-11-24 05:33:07'),
(5581, 'Administration', 'All Training Providers', 'View', '2023-11-24 05:35:09'),
(5582, 'Administration', 'All Training Providers', 'View', '2023-11-24 05:35:09'),
(5583, 'Administration', 'Training Providers', 'View', '2023-11-24 05:35:20'),
(5584, 'Administration', 'All Training Providers', 'View', '2023-11-24 05:35:20'),
(5585, 'Administration', 'All Training Providers', 'View', '2023-11-24 05:35:24'),
(5586, 'Administration', 'All Training Providers', 'View', '2023-11-24 05:35:24'),
(5587, 'Administration', 'Training Providers', 'View', '2023-11-24 05:36:18'),
(5588, 'Administration', 'All Training Providers', 'View', '2023-11-24 05:36:18'),
(5589, 'Administration', 'All Training Providers', 'View', '2023-11-24 05:40:02'),
(5590, 'Administration', 'All Training Providers', 'View', '2023-11-24 05:40:08'),
(5591, 'Administration', 'Subject Matter Expert', 'View', '2023-11-24 05:40:08'),
(5592, 'Administration', 'All Training Providers', 'View', '2023-11-24 05:40:55'),
(5593, 'Administration', 'Subject Matter Expert', 'View', '2023-11-24 05:41:09'),
(5594, 'Administration', 'Subject Matter Expert', 'View', '2023-11-24 05:44:19'),
(5595, 'Administration', 'Subject Matter Expert', 'View', '2023-11-24 05:45:11'),
(5596, 'Administration', 'Training Providers', 'View', '2023-11-24 05:45:21'),
(5597, 'Administration', 'Subject Matter Expert', 'View', '2023-11-24 05:45:24'),
(5598, 'Administration', 'Subject Matter Expert', 'View', '2023-11-24 05:45:37'),
(5599, 'Administration', 'Training Providers', 'View', '2023-11-24 05:45:39'),
(5600, 'Administration', 'Subject Matter Expert', 'View', '2023-11-24 05:45:42'),
(5601, 'Administration', 'Subject Matter Expert', 'View', '2023-11-24 05:47:19'),
(5602, 'Administration', 'Subject Matter Expert', 'View', '2023-11-24 05:47:39'),
(5603, 'Administration', 'Subject Matter Expert', 'View', '2023-11-24 05:47:39'),
(5604, 'Administration', 'Subject Matter Expert', 'View', '2023-11-24 05:47:46'),
(5605, 'Administration', 'Subject Matter Expert', 'View', '2023-11-24 05:50:36'),
(5606, 'Administration', 'Subject Matter Expert', 'View', '2023-11-24 05:50:39'),
(5607, 'Administration', 'Subject Matter Expert', 'View', '2023-11-24 05:51:08'),
(5608, 'Administration', 'Subject Matter Expert', 'View', '2023-11-24 05:51:09'),
(5609, 'Administration', 'Subject Matter Expert', 'View', '2023-11-24 05:51:11'),
(5610, 'Administration', 'Subject Matter Expert', 'View', '2023-11-24 05:51:16'),
(5611, 'Administration', 'Subject Matter Expert', 'View', '2023-11-24 05:51:27'),
(5612, 'Administration', 'Subject Matter Expert', 'View', '2023-11-24 05:51:45'),
(5613, 'Administration', 'Subject Matter Expert', 'Deactivate', '2023-11-24 05:51:47'),
(5614, 'Administration', 'Subject Matter Expert', 'View', '2023-11-24 05:51:47'),
(5615, 'Administration', 'Subject Matter Expert', 'View', '2023-11-24 05:51:53'),
(5616, 'Administration', 'Subject Matter Expert', 'View', '2023-11-24 05:51:55'),
(5617, 'Administration', 'Subject Matter Expert', 'View', '2023-11-24 05:51:58'),
(5618, 'Administration', 'Subject Matter Expert', 'Deactivate', '2023-11-24 05:52:00'),
(5619, 'Administration', 'Subject Matter Expert', 'View', '2023-11-24 05:52:00'),
(5620, 'Administration', 'Subject Matter Expert', 'View', '2023-11-24 05:52:02'),
(5621, 'Administration', 'Subject Matter Expert', 'View', '2023-11-24 05:52:04'),
(5622, 'Administration', 'Subject Matter Expert', 'View', '2023-11-24 05:52:06'),
(5623, 'Administration', 'Subject Matter Expert', 'View', '2023-11-24 05:52:07'),
(5624, 'Administration', 'Training Providers', 'View', '2023-11-24 05:52:20'),
(5625, 'Administration', 'Training Providers', 'View', '2023-11-24 05:52:24'),
(5626, 'Administration', 'Subject Matter Expert', 'View', '2023-11-24 05:52:28'),
(5627, 'Administration', 'Training Providers', 'View', '2023-11-24 05:52:30'),
(5628, 'Administration', 'Subject Matter Expert', 'View', '2023-11-24 05:52:33'),
(5629, 'Administration', 'All Training Providers', 'View', '2023-11-24 05:52:38'),
(5630, 'Administration', 'All Training Providers', 'View', '2023-11-24 05:52:40'),
(5631, 'Administration', 'All Training Providers', 'View', '2023-11-24 05:52:44'),
(5632, 'Administration', 'Training Providers', 'View', '2023-11-24 05:52:48'),
(5633, 'Administration', 'Training Providers', 'View', '2023-11-24 05:53:26'),
(5634, 'Administration', 'Training Providers', 'View', '2023-11-24 05:53:55'),
(5635, 'Administration', 'Training Providers', 'View', '2023-11-24 05:55:16'),
(5636, 'Administration', 'Subject Matter Expert', 'View', '2023-11-24 05:58:22'),
(5637, 'Administration', 'Subject Matter Expert', 'View', '2023-11-24 05:58:23'),
(5638, 'Administration', 'Subject Matter Expert', 'View', '2023-11-24 05:58:40'),
(5639, 'Administration', 'Training Providers', 'View', '2023-11-24 06:00:06'),
(5640, 'Administration', 'Training Providers', 'View', '2023-11-24 06:00:23'),
(5641, 'Administration', 'Training Providers', 'View', '2023-11-24 06:03:59'),
(5642, 'Administration', 'Training Providers', 'View', '2023-11-24 06:04:11'),
(5643, 'Administration', 'Training Providers', 'View', '2023-11-24 06:06:45'),
(5644, 'Administration', 'Training Providers', 'View', '2023-11-24 06:07:01'),
(5645, 'Administration', 'Training Providers', 'View', '2023-11-24 06:07:09'),
(5646, 'Administration', 'Training Providers', 'View', '2023-11-24 06:09:11'),
(5647, 'Administration', 'All Training Providers', 'View', '2023-11-24 06:12:04'),
(5648, 'Administration', 'Training Providers', 'View', '2023-11-24 06:12:15'),
(5649, 'Administration', 'All Training Providers', 'View', '2023-12-06 01:30:13'),
(5650, 'Administration', 'All Request for Local Scholarship', 'View', '2023-12-06 01:33:47'),
(5651, 'Administration', 'All Request for Foreign Scholarship', 'View', '2023-12-06 01:33:47'),
(5652, 'Administration', 'Subject Matter Expert', 'View', '2023-12-06 01:37:06'),
(5653, 'Administration', 'Subject Matter Expert', 'View', '2023-12-06 01:37:16'),
(5654, 'Administration', 'Subject Matter Expert', 'View', '2023-12-06 05:58:01'),
(5655, 'Administration', 'All Training Providers', 'View', '2023-12-06 05:58:12'),
(5656, 'Administration', 'Subject Matter Expert', 'View', '2023-12-06 06:08:18'),
(5657, 'Administration', 'All Training Providers', 'View', '2023-12-06 07:02:51'),
(5658, 'Administration', 'All Training Providers', 'View', '2023-12-06 07:12:15'),
(5659, 'Administration', 'All Training Providers', 'View', '2023-12-06 07:15:19'),
(5660, 'Administration', 'All Training Providers', 'View', '2023-12-11 03:07:33'),
(5661, 'Administration', 'All Training Providers', 'View', '2023-12-11 03:07:48'),
(5662, 'Administration', 'Subject Matter Expert', 'View', '2023-12-11 03:16:45'),
(5663, 'Administration', 'All Request for Local Scholarship', 'View', '2023-12-11 03:34:19'),
(5664, 'Administration', 'All Request for Foreign Scholarship', 'View', '2023-12-11 03:34:19'),
(5665, 'Administration', 'Get All Request', 'View', '2023-12-20 07:52:32'),
(5666, 'Administration', 'Get All Request', 'View', '2023-12-20 07:53:42'),
(5667, 'Administration', 'Get All Request', 'View', '2023-12-20 07:54:17'),
(5668, 'Administration', 'Get All Request', 'View', '2023-12-20 07:54:52'),
(5669, 'sample_user', 'All Planned Competency', 'View', '2024-01-04 06:59:38'),
(5670, 'sample_user', 'All Planned Competency', 'View', '2024-01-04 06:59:38'),
(5671, 'sample_user', 'All Planned Competency', 'View', '2024-01-04 06:59:38'),
(5672, 'sample_user', 'All Planned Competency', 'View', '2024-01-04 07:01:05'),
(5673, 'sample_user', 'All Planned Competency', 'View', '2024-01-04 07:01:05'),
(5674, 'sample_user', 'All Planned Competency', 'View', '2024-01-04 07:01:05'),
(5675, 'sample_user', 'All Certificates', 'View', '2024-01-04 07:01:07'),
(5676, 'sample_user', 'User scholarship request', 'View', '2024-01-04 07:01:09'),
(5677, 'sample_user', 'User scholarship request', 'View', '2024-01-04 07:01:09'),
(5678, 'sample_user', 'User scholarship request', 'View', '2024-01-04 07:01:09'),
(5679, 'sample_user', 'User scholarship request', 'View', '2024-01-04 07:01:09'),
(5680, 'sample_user', 'All Certificates', 'View', '2024-01-04 07:01:13'),
(5681, 'sample_user', 'User scholarship request', 'View', '2024-01-04 07:01:15'),
(5682, 'sample_user', 'User scholarship request', 'View', '2024-01-04 07:01:15'),
(5683, 'sample_user', 'User scholarship request', 'View', '2024-01-04 07:01:15'),
(5684, 'sample_user', 'User scholarship request', 'View', '2024-01-04 07:01:15'),
(5685, 'sample_user', 'All Certificates', 'View', '2024-01-04 07:01:18'),
(5686, 'sample_user', 'User scholarship request', 'View', '2024-01-04 07:01:21'),
(5687, 'sample_user', 'User scholarship request', 'View', '2024-01-04 07:01:21'),
(5688, 'sample_user', 'User scholarship request', 'View', '2024-01-04 07:01:21'),
(5689, 'sample_user', 'User scholarship request', 'View', '2024-01-04 07:01:21'),
(5690, 'sample_user', 'All Certificates', 'View', '2024-01-04 07:02:04'),
(5691, 'sample_user', 'User scholarship request', 'View', '2024-01-04 07:02:06'),
(5692, 'sample_user', 'User scholarship request', 'View', '2024-01-04 07:02:06'),
(5693, 'sample_user', 'User scholarship request', 'View', '2024-01-04 07:02:06'),
(5694, 'sample_user', 'User scholarship request', 'View', '2024-01-04 07:02:06'),
(5695, 'sample_user', 'All Planned Competency', 'View', '2024-01-16 06:26:44'),
(5696, 'sample_user', 'All Planned Competency', 'View', '2024-01-16 06:33:43'),
(5697, 'sample_user', 'All Planned Competency', 'View', '2024-01-16 06:34:31'),
(5698, 'sample_user', 'All Planned Competency', 'View', '2024-01-16 06:34:48'),
(5699, 'sample_user', 'All Planned Competency', 'View', '2024-01-16 06:35:43'),
(5700, 'sample_user', 'All Planned Competency', 'View', '2024-01-16 06:36:23'),
(5701, 'sample_user', 'All Planned Competency', 'View', '2024-01-16 07:00:26'),
(5702, 'sample_user', 'All Planned Competency', 'View', '2024-01-16 07:00:43'),
(5703, 'supervisor2', 'All Planned Competency', 'View', '2024-01-16 10:08:04'),
(5704, 'Administration', 'Subject Matter Expert', 'View', '2024-01-19 05:45:08'),
(5705, 'Administration', 'All Training Providers', 'View', '2024-01-19 05:45:29'),
(5706, 'Administration', 'All Training Providers', 'View', '2024-01-19 05:45:35'),
(5707, 'Administration', 'Subject Matter Expert', 'View', '2024-01-19 05:45:35'),
(5708, 'Administration', 'All Training Providers', 'View', '2024-01-19 05:45:45'),
(5709, 'Administration', 'All Training Providers', 'View', '2024-01-19 07:06:33'),
(5710, 'Administration', 'All Training Providers', 'View', '2024-01-19 08:17:32'),
(5711, 'Administration', 'Subject Matter Expert', 'View', '2024-01-19 08:17:42'),
(5712, 'Administration', 'All Training Providers', 'View', '2024-02-15 06:40:10'),
(5713, 'Administration', 'All Training Providers', 'View', '2024-02-15 06:40:15'),
(5714, 'Administration', 'Subject Matter Expert', 'View', '2024-02-15 06:40:15'),
(5715, 'Administration', 'All Training Providers', 'View', '2024-02-15 06:41:26'),
(5716, 'Administration', 'Subject Matter Expert', 'View', '2024-02-16 10:03:12'),
(5717, 'Administration', 'Training Providers', 'View', '2024-02-22 13:29:03'),
(5718, 'Administration', 'Training Providers', 'View', '2024-02-22 13:29:48'),
(5719, 'Administration', 'Training Providers', 'View', '2024-02-22 13:30:11'),
(5720, 'Administration', 'Training Providers', 'View', '2024-02-22 13:32:46'),
(5721, 'Administration', 'Training Providers', 'View', '2024-02-22 13:33:12'),
(5722, 'Administration', 'Training Providers', 'View', '2024-02-22 13:52:58'),
(5723, 'Administration', 'Training Providers', 'View', '2024-02-22 13:53:35'),
(5724, 'Administration', 'Training Providers', 'View', '2024-02-22 13:54:50'),
(5725, 'Administration', 'Training Providers', 'View', '2024-02-22 13:56:13'),
(5726, 'Administration', 'Training Providers', 'View', '2024-02-22 13:57:52'),
(5727, 'Administration', 'Training Providers', 'View', '2024-02-23 02:54:39'),
(5728, 'Administration', 'Training Providers', 'View', '2024-02-23 02:55:42'),
(5729, 'Administration', 'Training Providers', 'View', '2024-02-23 02:55:50'),
(5730, 'Administration', 'Training Providers', 'View', '2024-02-23 03:16:17'),
(5731, 'Administration', 'Training Providers', 'View', '2024-02-23 03:17:58'),
(5732, 'Administration', 'Training Providers', 'View', '2024-02-23 03:32:02'),
(5733, 'Administration', 'Training Providers', 'View', '2024-02-23 03:32:31'),
(5734, 'Administration', 'Training Providers', 'View', '2024-02-23 03:34:02'),
(5735, 'Administration', 'Training Providers', 'View', '2024-02-23 03:36:52'),
(5736, 'Administration', 'Training Providers', 'View', '2024-02-23 03:37:36'),
(5737, 'Administration', 'Training Providers', 'View', '2024-02-23 03:40:21'),
(5738, 'Administration', 'Training Providers', 'View', '2024-02-23 03:49:07'),
(5739, 'Administration', 'Training Providers', 'View', '2024-02-23 03:49:44'),
(5740, 'Administration', 'Training Providers', 'View', '2024-02-23 03:50:11'),
(5741, 'Administration', 'Training Providers', 'View', '2024-02-23 03:50:47'),
(5742, 'Administration', 'Training Providers', 'View', '2024-02-23 03:57:56'),
(5743, 'Administration', 'Training Providers', 'View', '2024-02-23 04:10:39'),
(5744, 'Administration', 'Training Providers', 'View', '2024-02-23 04:10:54'),
(5745, 'Administration', 'Training Providers', 'View', '2024-02-23 05:36:19'),
(5746, 'Administration', 'Training Providers', 'View', '2024-02-23 05:39:36'),
(5747, 'Administration', 'Training Providers', 'View', '2024-02-23 05:40:06'),
(5748, 'Administration', 'Training Providers', 'View', '2024-02-23 05:46:52'),
(5749, 'Administration', 'Training Providers', 'View', '2024-02-23 05:47:08'),
(5750, 'Administration', 'Training Providers', 'View', '2024-02-23 05:47:53'),
(5751, 'Administration', 'Training Providers', 'View', '2024-02-23 05:48:25'),
(5752, 'Administration', 'Training Providers', 'View', '2024-02-23 05:49:15'),
(5753, 'Administration', 'Training Providers', 'View', '2024-02-23 05:49:47'),
(5754, 'Administration', 'Training Providers', 'View', '2024-02-23 06:03:28'),
(5755, 'Administration', 'Training Providers', 'View', '2024-02-23 06:27:18'),
(5756, 'Administration', 'Training Providers', 'View', '2024-02-23 06:28:57'),
(5757, 'Administration', 'All Training Providers', 'View', '2024-02-23 06:29:34'),
(5758, 'Administration', 'All Training Providers', 'View', '2024-02-23 06:29:36'),
(5759, 'Administration', 'Subject Matter Expert', 'View', '2024-02-23 06:29:36'),
(5760, 'Administration', 'Training Providers', 'View', '2024-02-23 06:29:56'),
(5761, 'Administration', 'Training Providers', 'View', '2024-02-23 06:30:33'),
(5762, 'Administration', 'Training Providers', 'View', '2024-02-23 06:30:40'),
(5763, 'Administration', 'All Training Providers', 'View', '2024-02-23 06:31:34'),
(5764, 'Administration', 'Subject Matter Expert', 'View', '2024-02-23 06:31:37'),
(5765, 'Administration', 'All Training Providers', 'View', '2024-02-23 06:31:37'),
(5766, 'Administration', 'Training Providers', 'View', '2024-02-23 06:31:57'),
(5767, 'Administration', 'Training Providers', 'View', '2024-02-23 06:32:05'),
(5768, 'Administration', 'All Training Providers', 'View', '2024-02-23 06:32:39'),
(5769, 'Administration', 'All Training Providers', 'View', '2024-02-23 06:32:42'),
(5770, 'Administration', 'Subject Matter Expert', 'View', '2024-02-23 06:32:42'),
(5771, 'Administration', 'Training Providers', 'View', '2024-02-23 06:34:45'),
(5772, 'Administration', 'All Training Providers', 'View', '2024-02-23 06:35:54'),
(5773, 'Administration', 'All Training Providers', 'View', '2024-02-23 06:35:57'),
(5774, 'Administration', 'Subject Matter Expert', 'View', '2024-02-23 06:35:57'),
(5775, 'Administration', 'Training Providers', 'View', '2024-02-23 06:36:24'),
(5776, 'Administration', 'Training Providers', 'View', '2024-02-23 06:36:43'),
(5777, 'Administration', 'All Training Providers', 'View', '2024-02-23 06:36:47'),
(5778, 'Administration', 'All Training Providers', 'View', '2024-02-23 06:36:49');
INSERT INTO `audit_logs` (`auditID`, `username`, `target`, `action`, `createdOn`) VALUES
(5779, 'Administration', 'Subject Matter Expert', 'View', '2024-02-23 06:36:49'),
(5780, 'Administration', 'Training Providers', 'View', '2024-02-23 06:58:43'),
(5781, 'Administration', 'Training Providers', 'View', '2024-02-23 06:58:47'),
(5782, 'Administration', 'Training Providers', 'View', '2024-02-23 06:59:18'),
(5783, 'Administration', 'Training Providers', 'View', '2024-02-23 06:59:18'),
(5784, 'Administration', 'Training Providers', 'View', '2024-02-23 07:05:04'),
(5785, 'Administration', 'Training Providers', 'View', '2024-02-23 07:09:02'),
(5786, 'Administration', 'Training Providers', 'View', '2024-02-23 07:09:29'),
(5787, 'Administration', 'Training Providers', 'View', '2024-02-23 07:09:44'),
(5788, 'Administration', 'Training Providers', 'View', '2024-02-23 07:44:28'),
(5789, 'Administration', 'Training Providers', 'View', '2024-02-23 07:44:38'),
(5790, 'Administration', 'Training Providers', 'View', '2024-02-24 03:44:31'),
(5791, 'Administration', 'Training Providers', 'View', '2024-02-24 03:46:57'),
(5792, 'Administration', 'Training Providers', 'View', '2024-02-24 03:48:18'),
(5793, 'Administration', 'Training Providers', 'View', '2024-02-24 03:48:18'),
(5794, 'Administration', 'Training Providers', 'View', '2024-02-24 03:48:18'),
(5795, 'Administration', 'Training Providers', 'View', '2024-02-24 04:30:36'),
(5796, 'Administration', 'Training Providers', 'View', '2024-02-24 04:30:36'),
(5797, 'Administration', 'Training Providers', 'View', '2024-02-24 04:30:41'),
(5798, 'Administration', 'Training Providers', 'View', '2024-02-24 04:45:28'),
(5799, 'Administration', 'Training Providers', 'View', '2024-02-24 04:45:29'),
(5800, 'Administration', 'Training Providers', 'View', '2024-02-24 04:49:09'),
(5801, 'Administration', 'Training Providers', 'View', '2024-02-24 04:49:10'),
(5802, 'Administration', 'Training Providers', 'View', '2024-02-24 04:51:25'),
(5803, 'Administration', 'Training Providers', 'View', '2024-02-24 04:51:26'),
(5804, 'Administration', 'Training Providers', 'View', '2024-02-24 05:05:08'),
(5805, 'Administration', 'Training Providers', 'View', '2024-02-24 05:05:08'),
(5806, 'Administration', 'Training Providers', 'View', '2024-02-24 05:08:34'),
(5807, 'Administration', 'Training Providers', 'View', '2024-02-24 05:08:36'),
(5808, 'Administration', 'Training Providers', 'View', '2024-02-24 05:10:35'),
(5809, 'Administration', 'Training Providers', 'View', '2024-02-24 06:14:35'),
(5810, 'Administration', 'Training Providers', 'View', '2024-02-24 07:03:10'),
(5811, 'Administration', 'Training Providers', 'View', '2024-02-24 07:03:40'),
(5812, 'Administration', 'Training Providers', 'View', '2024-02-24 07:04:53'),
(5813, 'Administration', 'Training Providers', 'View', '2024-02-24 07:04:54'),
(5814, 'Administration', 'Training Providers', 'View', '2024-02-24 07:05:26'),
(5815, 'Administration', 'Training Providers', 'View', '2024-02-24 07:05:28'),
(5816, 'Administration', 'Training Providers', 'View', '2024-02-24 07:06:13'),
(5817, 'Administration', 'Training Providers', 'View', '2024-02-24 07:06:14'),
(5818, 'Administration', 'Training Providers', 'View', '2024-02-24 07:08:11'),
(5819, 'Administration', 'Training Providers', 'View', '2024-02-24 07:08:11'),
(5820, 'Administration', 'Training Providers', 'View', '2024-02-24 07:44:49'),
(5821, 'Administration', 'Training Providers', 'View', '2024-02-24 07:45:13'),
(5822, 'Administration', 'Training Providers', 'View', '2024-02-24 07:45:22'),
(5823, 'Administration', 'Training Providers', 'View', '2024-02-24 07:45:31'),
(5824, 'Administration', 'Training Providers', 'View', '2024-02-24 08:22:54'),
(5825, 'Administration', 'Training Providers', 'View', '2024-02-24 08:27:46'),
(5826, 'Administration', 'Training Providers', 'View', '2024-02-24 08:28:17'),
(5827, 'Administration', 'Training Providers', 'View', '2024-03-01 01:55:16'),
(5828, 'Administration', 'Training Providers', 'View', '2024-03-01 01:56:59'),
(5829, 'Administration', 'Training Providers', 'View', '2024-03-01 01:57:05'),
(5830, 'Administration', 'All Training Providers', 'View', '2024-03-01 01:58:15'),
(5831, 'Administration', 'Training Provider', 'Create', '2024-03-01 01:59:57'),
(5832, 'Administration', 'All Training Providers', 'View', '2024-03-01 01:59:57'),
(5833, 'Administration', 'All Training Providers', 'View', '2024-03-01 01:59:59'),
(5834, 'Administration', 'Subject Matter Expert', 'View', '2024-03-01 01:59:59'),
(5835, 'Administration', 'All Training Providers', 'View', '2024-03-01 02:00:18'),
(5836, 'Administration', 'Training Providers', 'View', '2024-03-01 02:00:25'),
(5837, 'Administration', 'Training Providers', 'View', '2024-03-01 02:00:25'),
(5838, 'Administration', 'Training Providers', 'View', '2024-03-01 02:00:25'),
(5839, 'Administration', 'Training Providers', 'View', '2024-03-01 02:00:25'),
(5840, 'Administration', 'Training Providers', 'View', '2024-03-01 02:01:04'),
(5841, 'Administration', 'Training Providers', 'View', '2024-03-01 02:01:04'),
(5842, 'Administration', 'Training Providers', 'View', '2024-03-01 02:01:04'),
(5843, 'Administration', 'Training Providers', 'View', '2024-03-01 02:01:04'),
(5844, 'Administration', 'All Training Providers', 'View', '2024-03-01 02:09:57'),
(5845, 'Administration', 'All Training Providers', 'View', '2024-03-01 02:09:59'),
(5846, 'Administration', 'Subject Matter Expert', 'View', '2024-03-01 02:09:59'),
(5847, 'Administration', 'Training Providers', 'View', '2024-03-01 02:16:29'),
(5848, 'Administration', 'Training Providers', 'View', '2024-03-01 02:16:39'),
(5849, 'Administration', 'Training Providers', 'View', '2024-03-01 02:16:43'),
(5850, 'Administration', 'Training Providers', 'View', '2024-03-01 02:16:46'),
(5851, 'Administration', 'Training Providers', 'View', '2024-03-01 02:16:55'),
(5852, 'Administration', 'All Training Providers', 'View', '2024-03-01 02:18:27'),
(5853, 'Administration', 'All Training Providers', 'View', '2024-03-01 02:18:33'),
(5854, 'Administration', 'All Training Providers', 'View', '2024-03-01 02:18:38'),
(5855, 'Administration', 'Subject Matter Expert', 'View', '2024-03-01 02:18:38'),
(5856, 'Administration', 'All Training Providers', 'View', '2024-03-01 02:19:29'),
(5857, 'Administration', 'All Training Providers', 'View', '2024-03-01 02:19:30'),
(5858, 'Administration', 'Subject Matter Expert', 'View', '2024-03-01 02:19:30'),
(5859, 'Administration', 'All Training Providers', 'View', '2024-03-01 02:19:57'),
(5860, 'Administration', 'Training Provider', 'Create', '2024-03-01 02:21:22'),
(5861, 'Administration', 'All Training Providers', 'View', '2024-03-01 02:21:22'),
(5862, 'Administration', 'Training Providers', 'View', '2024-03-01 02:22:46'),
(5863, 'Administration', 'Training Providers', 'View', '2024-03-01 02:24:37'),
(5864, 'Administration', 'Training Providers', 'View', '2024-03-01 02:24:37'),
(5865, 'Administration', 'Training Providers', 'View', '2024-03-01 02:24:37'),
(5866, 'Administration', 'Training Providers', 'View', '2024-03-01 02:24:37'),
(5867, 'Administration', 'All Training Providers', 'View', '2024-03-01 02:25:03'),
(5868, 'Administration', 'All Training Providers', 'View', '2024-03-01 02:25:05'),
(5869, 'Administration', 'Subject Matter Expert', 'View', '2024-03-01 02:25:05'),
(5870, 'Administration', 'Training Providers', 'View', '2024-03-01 10:58:27'),
(5871, 'Administration', 'Training Providers', 'View', '2024-03-01 11:02:32'),
(5872, 'Administration', 'Training Providers', 'View', '2024-03-01 11:03:23'),
(5873, 'Administration', 'Training Providers', 'View', '2024-03-01 11:08:49'),
(5874, 'Administration', 'Training Providers', 'View', '2024-03-02 08:08:51'),
(5875, 'Administration', 'All Training Providers', 'View', '2024-03-06 04:40:21'),
(5876, 'Administration', 'All Training Providers', 'View', '2024-03-09 09:33:35'),
(5877, 'Administration', 'All Training Providers', 'View', '2024-03-09 10:02:35'),
(5878, 'Administration', 'All Training Providers', 'View', '2024-03-09 10:02:38'),
(5879, 'Administration', 'Subject Matter Expert', 'View', '2024-03-09 10:02:38'),
(5880, 'Administration', 'Subject Matter Expert', 'View', '2024-03-09 10:06:35'),
(5881, 'Administration', 'All Training Providers', 'View', '2024-03-09 10:06:41'),
(5882, 'Administration', 'All Training Providers', 'View', '2024-03-09 10:06:42'),
(5883, 'Administration', 'Subject Matter Expert', 'View', '2024-03-09 10:06:42'),
(5884, 'sample_user', 'All Certificates', 'View', '2024-03-11 03:03:20'),
(5885, 'sample_user', 'User scholarship request', 'View', '2024-03-11 03:03:22'),
(5886, 'sample_user', 'User scholarship request', 'View', '2024-03-11 03:03:22'),
(5887, 'sample_user', 'User scholarship request', 'View', '2024-03-11 03:03:23'),
(5888, 'sample_user', 'User scholarship request', 'View', '2024-03-11 03:03:23'),
(5889, 'sample_user', 'All Certificates', 'View', '2024-03-11 03:03:25'),
(5890, 'sample_user', 'All Certificates', 'View', '2024-03-11 03:05:18'),
(5891, 'sample_user', 'All Certificates', 'View', '2024-03-11 03:09:06'),
(5892, 'sample_user', 'All Certificates', 'View', '2024-03-11 03:22:10'),
(5893, 'sample_user', 'All Certificates', 'View', '2024-03-11 03:22:31'),
(5894, 'sample_user', 'All Certificates', 'View', '2024-03-11 03:24:25'),
(5895, 'sample_user', 'All Certificates', 'View', '2024-03-11 03:25:50'),
(5896, 'sample_user', 'All Certificates', 'View', '2024-03-11 03:25:57'),
(5897, 'sample_user', 'All Certificates', 'View', '2024-03-11 03:26:40'),
(5898, 'sample_user', 'All Certificates', 'View', '2024-03-11 03:26:46'),
(5899, 'sample_user', 'All Certificates', 'View', '2024-03-11 03:27:24'),
(5900, 'sample_user', 'All Certificates', 'View', '2024-03-11 03:27:57'),
(5901, 'sample_user', 'All Certificates', 'View', '2024-03-11 03:28:12'),
(5902, 'sample_user', 'User scholarship request', 'View', '2024-03-11 03:28:15'),
(5903, 'sample_user', 'User scholarship request', 'View', '2024-03-11 03:28:15'),
(5904, 'sample_user', 'User scholarship request', 'View', '2024-03-11 03:28:15'),
(5905, 'sample_user', 'User scholarship request', 'View', '2024-03-11 03:28:15'),
(5906, 'sample_user', 'All Certificates', 'View', '2024-03-11 03:28:17'),
(5907, 'sample_user', 'All Certificates', 'View', '2024-03-11 03:28:23'),
(5908, 'sample_user', 'All Certificates', 'View', '2024-03-11 03:31:57'),
(5909, 'sample_user', 'All Certificates', 'View', '2024-03-11 03:32:08'),
(5910, 'sample_user', 'All Certificates', 'View', '2024-03-11 03:32:20'),
(5911, 'sample_user', 'All Certificates', 'View', '2024-03-11 03:33:47'),
(5912, 'sample_user', 'All Certificates', 'View', '2024-03-11 03:36:08'),
(5913, 'sample_user', 'All Certificates', 'View', '2024-03-11 03:36:18'),
(5914, 'sample_user', 'User scholarship request', 'View', '2024-03-11 03:36:49'),
(5915, 'sample_user', 'User scholarship request', 'View', '2024-03-11 03:36:49'),
(5916, 'sample_user', 'User scholarship request', 'View', '2024-03-11 03:36:49'),
(5917, 'sample_user', 'User scholarship request', 'View', '2024-03-11 03:36:49'),
(5918, 'sample_user', 'All Certificates', 'View', '2024-03-11 03:36:52'),
(5919, 'sample_user', 'User scholarship request', 'View', '2024-03-11 03:36:56'),
(5920, 'sample_user', 'User scholarship request', 'View', '2024-03-11 03:36:56'),
(5921, 'sample_user', 'User scholarship request', 'View', '2024-03-11 03:36:56'),
(5922, 'sample_user', 'User scholarship request', 'View', '2024-03-11 03:36:56'),
(5923, 'sample_user', 'All Certificates', 'View', '2024-03-11 03:40:55'),
(5924, 'sample_user', 'All Certificates', 'View', '2024-03-11 03:43:02'),
(5925, 'sample_user', 'User scholarship request', 'View', '2024-03-11 03:43:13'),
(5926, 'sample_user', 'User scholarship request', 'View', '2024-03-11 03:43:13'),
(5927, 'sample_user', 'User scholarship request', 'View', '2024-03-11 03:43:13'),
(5928, 'sample_user', 'User scholarship request', 'View', '2024-03-11 03:43:13'),
(5929, 'sample_user', 'All Certificates', 'View', '2024-03-11 03:43:42'),
(5930, 'sample_user', 'User scholarship request', 'View', '2024-03-11 03:43:44'),
(5931, 'sample_user', 'User scholarship request', 'View', '2024-03-11 03:43:44'),
(5932, 'sample_user', 'User scholarship request', 'View', '2024-03-11 03:43:44'),
(5933, 'sample_user', 'User scholarship request', 'View', '2024-03-11 03:43:44'),
(5934, 'sample_user', 'All Certificates', 'View', '2024-03-11 03:43:45'),
(5935, 'sample_user', 'User scholarship request', 'View', '2024-03-11 03:49:18'),
(5936, 'sample_user', 'User scholarship request', 'View', '2024-03-11 03:49:18'),
(5937, 'sample_user', 'User scholarship request', 'View', '2024-03-11 03:49:18'),
(5938, 'sample_user', 'User scholarship request', 'View', '2024-03-11 03:49:19'),
(5939, 'sample_user', 'All Certificates', 'View', '2024-03-11 03:49:20'),
(5940, 'sample_user', 'User scholarship request', 'View', '2024-03-11 03:49:26'),
(5941, 'sample_user', 'User scholarship request', 'View', '2024-03-11 03:49:26'),
(5942, 'sample_user', 'User scholarship request', 'View', '2024-03-11 03:49:27'),
(5943, 'sample_user', 'User scholarship request', 'View', '2024-03-11 03:49:27'),
(5944, 'sample_user', 'All Certificates', 'View', '2024-03-11 03:54:50'),
(5945, 'sample_user', 'All Planned Competency', 'View', '2024-03-11 03:55:33'),
(5946, 'sample_user', 'All Planned Competency', 'View', '2024-03-11 03:55:33'),
(5947, 'sample_user', 'All Planned Competency', 'View', '2024-03-11 03:55:33'),
(5948, 'sample_user', 'All Certificates', 'View', '2024-03-11 03:56:41'),
(5949, 'sample_user', 'All Certificates', 'View', '2024-03-11 03:56:47'),
(5950, 'sample_user', 'All Certificates', 'View', '2024-03-11 03:56:51'),
(5951, 'sample_user', 'All Certificates', 'View', '2024-03-11 03:56:52'),
(5952, 'sample_user', 'All Certificates', 'View', '2024-03-11 04:01:38'),
(5953, 'sample_user', 'User scholarship request', 'View', '2024-03-11 04:01:39'),
(5954, 'sample_user', 'User scholarship request', 'View', '2024-03-11 04:01:39'),
(5955, 'sample_user', 'User scholarship request', 'View', '2024-03-11 04:01:39'),
(5956, 'sample_user', 'User scholarship request', 'View', '2024-03-11 04:01:39'),
(5957, 'sample_user', 'All Certificates', 'View', '2024-03-11 04:01:45'),
(5958, 'sample_user', 'User scholarship request', 'View', '2024-03-11 04:02:27'),
(5959, 'sample_user', 'User scholarship request', 'View', '2024-03-11 04:02:27'),
(5960, 'sample_user', 'User scholarship request', 'View', '2024-03-11 04:02:27'),
(5961, 'sample_user', 'User scholarship request', 'View', '2024-03-11 04:02:27'),
(5962, 'sample_user', 'All Certificates', 'View', '2024-03-11 04:02:29'),
(5963, 'sample_user', 'All Certificates', 'View', '2024-03-11 04:58:12'),
(5964, 'sample_user', 'All Certificates', 'View', '2024-03-11 05:00:48'),
(5965, 'sample_user', 'All Certificates', 'View', '2024-03-11 05:02:22'),
(5966, 'sample_user', 'All Certificates', 'View', '2024-03-11 05:04:28'),
(5967, 'sample_user', 'All Certificates', 'View', '2024-03-11 05:04:41'),
(5968, 'sample_user', 'All Certificates', 'View', '2024-03-11 05:04:55'),
(5969, 'sample_user', 'All Certificates', 'View', '2024-03-11 05:04:59'),
(5970, 'sample_user', 'All Certificates', 'View', '2024-03-11 05:05:06'),
(5971, 'sample_user', 'All Certificates', 'View', '2024-03-11 05:05:18'),
(5972, 'sample_user', 'All Certificates', 'View', '2024-03-11 05:05:45'),
(5973, 'sample_user', 'All Certificates', 'View', '2024-03-11 05:08:49'),
(5974, 'sample_user', 'All Certificates', 'View', '2024-03-11 05:12:32'),
(5975, 'sample_user', 'All Certificates', 'View', '2024-03-11 05:14:38'),
(5976, 'sample_user', 'All Certificates', 'View', '2024-03-11 05:14:55'),
(5977, 'sample_user', 'All Certificates', 'View', '2024-03-11 05:15:53'),
(5978, 'sample_user', 'All Certificates', 'View', '2024-03-11 05:17:47'),
(5979, 'sample_user', 'All Certificates', 'View', '2024-03-11 05:20:11'),
(5980, 'sample_user', 'All Certificates', 'View', '2024-03-11 05:20:39'),
(5981, 'sample_user', 'All Certificates', 'View', '2024-03-11 05:21:26'),
(5982, 'sample_user', 'All Certificates', 'View', '2024-03-11 05:21:28'),
(5983, 'sample_user', 'All Certificates', 'View', '2024-03-11 05:23:06'),
(5984, 'sample_user', 'All Certificates', 'View', '2024-03-11 05:23:09'),
(5985, 'sample_user', 'All Certificates', 'View', '2024-03-11 05:23:12'),
(5986, 'sample_user', 'All Certificates', 'View', '2024-03-11 05:23:31'),
(5987, 'sample_user', 'All Certificates', 'View', '2024-03-11 05:23:47'),
(5988, 'sample_user', 'All Certificates', 'View', '2024-03-11 05:23:49'),
(5989, 'sample_user', 'All Certificates', 'View', '2024-03-11 05:24:18'),
(5990, 'sample_user', 'All Certificates', 'View', '2024-03-11 06:25:19'),
(5991, 'sample_user', 'All Certificates', 'View', '2024-03-11 06:26:35'),
(5992, 'sample_user', 'All Certificates', 'View', '2024-03-11 06:27:04'),
(5993, 'sample_user', 'All Certificates', 'View', '2024-03-11 06:28:42'),
(5994, 'sample_user', 'All Certificates', 'View', '2024-03-11 06:29:15'),
(5995, 'sample_user', 'All Certificates', 'View', '2024-03-11 06:29:17'),
(5996, 'Administration', 'Training Providers', 'View', '2024-03-11 06:39:24'),
(5997, 'sample_user', 'All Certificates', 'View', '2024-03-11 06:53:11'),
(5998, 'sample_user', 'All Certificates', 'View', '2024-03-11 06:53:13'),
(5999, 'sample_user', 'All Certificates', 'View', '2024-03-11 06:53:15'),
(6000, 'sample_user', 'All Certificates', 'View', '2024-03-11 06:53:16'),
(6001, 'sample_user', 'All Certificates', 'View', '2024-03-11 06:53:18'),
(6002, 'sample_user', 'All Certificates', 'View', '2024-03-11 07:56:59'),
(6003, 'sample_user', 'All Certificates', 'View', '2024-03-11 07:57:04'),
(6004, 'sample_user', 'All Certificates', 'View', '2024-03-11 07:57:06'),
(6005, 'sample_user', 'All Certificates', 'View', '2024-03-11 07:57:07'),
(6006, 'sample_user', 'All Certificates', 'View', '2024-03-11 07:57:09'),
(6007, 'sample_user', 'All Certificates', 'View', '2024-03-11 07:57:12'),
(6008, 'sample_user', 'All Certificates', 'View', '2024-03-11 08:06:44'),
(6009, 'sample_user', 'All Certificates', 'View', '2024-03-11 08:07:44'),
(6010, 'sample_user', 'All Certificates', 'View', '2024-03-11 08:07:48'),
(6011, 'sample_user', 'User scholarship request', 'View', '2024-03-11 08:07:54'),
(6012, 'sample_user', 'User scholarship request', 'View', '2024-03-11 08:07:55'),
(6013, 'sample_user', 'User scholarship request', 'View', '2024-03-11 08:07:55'),
(6014, 'sample_user', 'User scholarship request', 'View', '2024-03-11 08:07:55'),
(6015, 'sample_user', 'User scholarship request', 'View', '2024-03-11 08:07:59'),
(6016, 'sample_user', 'User scholarship request', 'View', '2024-03-11 08:08:00'),
(6017, 'sample_user', 'User scholarship request', 'View', '2024-03-11 08:08:00'),
(6018, 'sample_user', 'User scholarship request', 'View', '2024-03-11 08:08:00'),
(6019, 'sample_user', 'All Certificates', 'View', '2024-03-11 08:08:01'),
(6020, 'sample_user', 'All Certificates', 'View', '2024-03-11 08:14:50'),
(6021, 'sample_user', 'All Certificates', 'View', '2024-03-11 08:15:36'),
(6022, 'sample_user', 'All Certificates', 'View', '2024-03-11 08:15:37'),
(6023, 'Administration', 'Training Providers', 'View', '2024-03-16 07:57:33'),
(6024, 'Administration', 'Training Providers', 'View', '2024-03-16 07:58:30'),
(6025, 'Administration', 'Training Providers', 'View', '2024-03-16 07:58:43'),
(6026, 'Administration', 'Training Providers', 'View', '2024-03-16 08:01:30'),
(6027, 'Administration', 'All Training Providers', 'View', '2024-03-16 08:03:08'),
(6028, 'Administration', 'All Training Providers', 'View', '2024-03-16 08:03:10'),
(6029, 'Administration', 'Subject Matter Expert', 'View', '2024-03-16 08:03:10'),
(6030, 'Administration', 'All Training Providers', 'View', '2024-03-16 09:03:51'),
(6031, 'Administration', 'All Training Providers', 'View', '2024-03-16 09:03:54'),
(6032, 'Administration', 'Subject Matter Expert', 'View', '2024-03-16 09:03:54'),
(6033, 'Administration', 'All Training Providers', 'View', '2024-03-16 09:04:59'),
(6034, 'Administration', 'All Training Providers', 'View', '2024-03-16 09:05:08'),
(6035, 'Administration', 'Subject Matter Expert', 'View', '2024-03-16 09:05:08'),
(6036, 'Administration', 'All Training Providers', 'View', '2024-03-16 09:14:21'),
(6037, 'Administration', 'All Training Providers', 'View', '2024-03-16 09:14:30'),
(6038, 'Administration', 'All Training Providers', 'View', '2024-03-16 09:14:32'),
(6039, 'Administration', 'Subject Matter Expert', 'View', '2024-03-16 09:14:32'),
(6040, 'Administration', 'All Training Providers', 'View', '2024-03-16 09:14:36'),
(6041, 'Administration', 'Subject Matter Expert', 'View', '2024-03-16 09:15:13'),
(6042, 'Administration', 'All Training Providers', 'View', '2024-03-16 09:15:13'),
(6043, 'Administration', 'All Training Providers', 'View', '2024-03-16 09:15:30'),
(6044, 'Administration', 'All Training Providers', 'View', '2024-03-16 09:25:13'),
(6045, 'Administration', 'All Training Providers', 'View', '2024-03-16 09:25:14'),
(6046, 'Administration', 'Subject Matter Expert', 'View', '2024-03-16 09:25:14'),
(6047, 'Administration', 'All Training Providers', 'View', '2024-03-16 09:25:27'),
(6048, 'Administration', 'Training Providers', 'View', '2024-03-18 05:26:33'),
(6049, 'Administration', 'Training Providers', 'View', '2024-03-18 05:26:38'),
(6050, 'Administration', 'Training Providers', 'View', '2024-03-18 05:26:45'),
(6051, 'Administration', 'Training Providers', 'View', '2024-03-18 05:29:25'),
(6052, 'Administration', 'Training Providers', 'View', '2024-03-18 05:30:06'),
(6053, 'Administration', 'Training Providers', 'View', '2024-03-18 05:30:10'),
(6054, 'Administration', 'Training Providers', 'View', '2024-03-18 05:30:15'),
(6055, 'Administration', 'Training Providers', 'View', '2024-03-18 05:30:25'),
(6056, 'Administration', 'Training Providers', 'View', '2024-03-18 05:30:35'),
(6057, 'Administration', 'Training Providers', 'View', '2024-03-18 05:30:39'),
(6058, 'Administration', 'Training Providers', 'View', '2024-03-18 05:36:35'),
(6059, 'Administration', 'Training Providers', 'View', '2024-03-18 05:50:19'),
(6060, 'Administration', 'Training Providers', 'View', '2024-03-18 06:03:10'),
(6061, 'Administration', 'Training Providers', 'View', '2024-03-18 06:03:12'),
(6062, 'Administration', 'Training Providers', 'View', '2024-03-18 06:08:14'),
(6063, 'Administration', 'Training Providers', 'View', '2024-03-18 06:18:37'),
(6064, 'Administration', 'Training Providers', 'View', '2024-03-18 06:22:05'),
(6065, 'Administration', 'Training Providers', 'View', '2024-03-18 06:23:00'),
(6066, 'Administration', 'Training Providers', 'View', '2024-03-18 06:28:11'),
(6067, 'Administration', 'Training Providers', 'View', '2024-03-18 06:28:42'),
(6068, 'Administration', 'All Training Providers', 'View', '2024-03-18 06:31:29'),
(6069, 'Administration', 'Training Providers', 'View', '2024-03-18 06:31:41'),
(6070, 'Administration', 'Training Providers', 'View', '2024-03-18 06:33:44'),
(6071, 'Administration', 'All Training Providers', 'View', '2024-03-18 06:37:51'),
(6072, 'Administration', 'Subject Matter Expert', 'View', '2024-03-18 06:37:53'),
(6073, 'Administration', 'All Training Providers', 'View', '2024-03-18 06:37:53'),
(6074, 'Administration', 'Training Providers', 'View', '2024-03-18 08:53:05'),
(6075, 'Administration', 'Training Providers', 'View', '2024-03-18 08:54:00'),
(6076, 'Administration', 'Training Providers', 'View', '2024-03-18 08:55:51'),
(6077, 'Administration', 'Training Providers', 'View', '2024-03-18 08:58:46'),
(6078, 'Administration', 'All Training Providers', 'View', '2024-03-18 10:33:29'),
(6079, 'Administration', 'All Training Providers', 'View', '2024-03-18 10:33:31'),
(6080, 'Administration', 'Subject Matter Expert', 'View', '2024-03-18 10:33:31'),
(6081, 'Administration', 'All Training Providers', 'View', '2024-03-18 10:33:40'),
(6082, 'Administration', 'All Training Providers', 'View', '2024-03-18 10:33:43'),
(6083, 'Administration', 'Subject Matter Expert', 'View', '2024-03-18 10:33:43'),
(6084, 'Administration', 'Subject Matter Expert', 'View', '2024-03-18 10:34:13'),
(6085, 'Administration', 'Subject Matter Expert', 'View', '2024-03-18 10:34:15'),
(6086, 'Administration', 'All Training Providers', 'View', '2024-03-18 10:39:39'),
(6087, 'Administration', 'All Training Providers', 'View', '2024-03-18 10:39:47'),
(6088, 'Administration', 'All Training Providers', 'View', '2024-03-18 10:39:58'),
(6089, 'Administration', 'Subject Matter Expert', 'View', '2024-04-08 03:52:36'),
(6090, 'Administration', 'Training Providers', 'View', '2024-04-08 09:03:39'),
(6091, 'Administration', 'Training Providers', 'View', '2024-04-11 03:54:02'),
(6092, 'Administration', 'Training Providers', 'View', '2024-04-11 04:01:22'),
(6093, 'Administration', 'Training Providers', 'View', '2024-04-11 04:05:13'),
(6094, 'Administration', 'Training Providers', 'View', '2024-04-11 08:29:44'),
(6095, 'Administration', 'All Training Providers', 'View', '2024-04-11 09:38:54'),
(6096, 'Administration', 'All Training Providers', 'View', '2024-04-11 09:38:58'),
(6097, 'Administration', 'Subject Matter Expert', 'View', '2024-04-11 09:38:58'),
(6098, 'Administration', 'All Training Providers', 'View', '2024-04-11 09:39:06'),
(6099, 'Administration', 'All Training Providers', 'View', '2024-04-11 09:39:08'),
(6100, 'Administration', 'Subject Matter Expert', 'View', '2024-04-11 09:39:08'),
(6101, 'Administration', 'Training Providers', 'View', '2024-04-11 09:39:32'),
(6102, 'Administration', 'All Training Providers', 'View', '2024-04-11 09:39:38'),
(6103, 'Administration', 'Training Provider', 'Create', '2024-04-11 09:40:58'),
(6104, 'Administration', 'All Training Providers', 'View', '2024-04-11 09:40:58'),
(6105, 'Administration', 'All Training Providers', 'View', '2024-04-11 09:41:06'),
(6106, 'Administration', 'Subject Matter Expert', 'View', '2024-04-11 09:41:06'),
(6107, 'Administration', 'All Training Providers', 'View', '2024-04-11 09:42:06'),
(6108, 'Administration', 'Training Providers', 'View', '2024-04-11 09:42:12'),
(6109, 'Administration', 'Training Providers', 'View', '2024-04-11 09:42:12'),
(6110, 'Administration', 'Training Providers', 'View', '2024-04-11 09:42:12'),
(6111, 'Administration', 'Training Providers', 'View', '2024-04-11 09:42:12'),
(6112, 'Administration', 'Training Providers', 'View', '2024-04-11 09:47:49'),
(6113, 'Administration', 'Training Providers', 'View', '2024-04-11 09:47:49'),
(6114, 'Administration', 'Training Providers', 'View', '2024-04-11 09:47:50'),
(6115, 'Administration', 'Training Providers', 'View', '2024-04-11 09:47:50'),
(6116, 'Administration', 'Training Providers', 'View', '2024-04-11 09:54:37'),
(6117, 'Administration', 'Training Providers', 'View', '2024-04-11 09:54:37'),
(6118, 'Administration', 'Training Providers', 'View', '2024-04-11 09:54:37'),
(6119, 'Administration', 'Training Providers', 'View', '2024-04-11 09:54:37'),
(6120, 'Administration', 'Training Providers', 'View', '2024-04-11 09:55:43'),
(6121, 'Administration', 'Training Providers', 'View', '2024-04-11 09:55:44'),
(6122, 'Administration', 'Training Providers', 'View', '2024-04-11 09:55:44'),
(6123, 'Administration', 'Training Providers', 'View', '2024-04-11 09:55:44'),
(6124, 'Administration', 'Training Providers', 'View', '2024-04-11 09:58:33'),
(6125, 'Administration', 'Training Providers', 'View', '2024-04-11 09:58:34'),
(6126, 'Administration', 'Training Providers', 'View', '2024-04-11 09:58:34'),
(6127, 'Administration', 'Training Providers', 'View', '2024-04-11 09:58:34'),
(6128, 'Administration', 'Training Providers', 'View', '2024-04-11 09:58:54'),
(6129, 'Administration', 'Training Providers', 'View', '2024-04-11 09:58:54'),
(6130, 'Administration', 'Training Providers', 'View', '2024-04-11 09:58:54'),
(6131, 'Administration', 'Training Providers', 'View', '2024-04-11 09:58:54'),
(6132, 'Administration', 'Training Providers', 'View', '2024-04-11 09:59:11'),
(6133, 'Administration', 'Training Providers', 'View', '2024-04-11 09:59:11'),
(6134, 'Administration', 'Training Providers', 'View', '2024-04-11 09:59:11'),
(6135, 'Administration', 'Training Providers', 'View', '2024-04-11 09:59:11'),
(6136, 'Administration', 'Training Providers', 'View', '2024-04-11 09:59:56'),
(6137, 'Administration', 'Training Providers', 'View', '2024-04-11 10:00:44'),
(6138, 'Administration', 'Training Providers', 'View', '2024-04-11 10:14:19'),
(6139, 'Administration', 'Training Providers', 'View', '2024-04-11 10:15:13'),
(6140, 'Administration', 'Training Providers', 'View', '2024-04-11 10:19:23'),
(6141, 'Administration', 'Training Providers', 'View', '2024-04-11 10:19:31'),
(6142, 'Administration', 'Training Providers', 'View', '2024-04-11 10:22:45'),
(6143, 'Administration', 'Training Providers', 'View', '2024-04-11 10:26:07'),
(6144, 'Administration', 'All Training Providers', 'View', '2024-04-11 10:26:37'),
(6145, 'Administration', 'All Training Providers', 'View', '2024-04-11 10:26:39'),
(6146, 'Administration', 'Subject Matter Expert', 'View', '2024-04-11 10:26:39'),
(6147, 'Administration', 'Training Providers', 'View', '2024-04-11 10:26:54'),
(6148, 'Administration', 'All Training Providers', 'View', '2024-04-11 10:27:03'),
(6149, 'Administration', 'All Training Providers', 'View', '2024-04-11 10:27:05'),
(6150, 'Administration', 'Subject Matter Expert', 'View', '2024-04-11 10:27:05'),
(6151, 'Administration', 'Training Providers', 'View', '2024-04-11 10:27:17'),
(6152, 'Administration', 'Training Providers', 'View', '2024-04-11 12:04:49'),
(6153, 'Administration', 'Training Providers', 'View', '2024-04-11 12:04:49'),
(6154, 'Administration', 'Training Providers', 'View', '2024-04-11 12:04:49'),
(6155, 'Administration', 'Training Providers', 'View', '2024-04-11 12:04:49'),
(6156, 'Administration', 'All Training Providers', 'View', '2024-04-11 12:13:49'),
(6157, 'Administration', 'Training Providers', 'View', '2024-04-11 12:22:00'),
(6158, 'Administration', 'Training Providers', 'View', '2024-04-11 12:22:00'),
(6159, 'Administration', 'Training Providers', 'View', '2024-04-11 12:22:00'),
(6160, 'Administration', 'Training Providers', 'View', '2024-04-11 12:22:00'),
(6161, 'Administration', 'All Training Providers', 'View', '2024-04-11 12:23:36'),
(6162, 'Administration', 'All Training Providers', 'View', '2024-04-11 12:23:41'),
(6163, 'Administration', 'Training Providers', 'View', '2024-04-11 12:25:13'),
(6164, 'Administration', 'Training Providers', 'View', '2024-04-11 12:25:13'),
(6165, 'Administration', 'Training Providers', 'View', '2024-04-11 12:25:13'),
(6166, 'Administration', 'Training Providers', 'View', '2024-04-11 12:25:13'),
(6167, 'Administration', 'Training Providers', 'View', '2024-04-11 12:25:52'),
(6168, 'Administration', 'Training Providers', 'View', '2024-04-11 12:25:52'),
(6169, 'Administration', 'Training Providers', 'View', '2024-04-11 12:25:52'),
(6170, 'Administration', 'Training Providers', 'View', '2024-04-11 12:25:52'),
(6171, 'Administration', 'Training Providers', 'View', '2024-04-11 12:29:27'),
(6172, 'Administration', 'Training Providers', 'View', '2024-04-11 12:29:27'),
(6173, 'Administration', 'Training Providers', 'View', '2024-04-11 12:29:27'),
(6174, 'Administration', 'Training Providers', 'View', '2024-04-11 12:29:27'),
(6175, 'Administration', 'All Training Providers', 'View', '2024-04-11 12:31:15'),
(6176, 'Administration', 'All Training Providers', 'View', '2024-04-11 12:31:18'),
(6177, 'Administration', 'All Training Providers', 'View', '2024-04-11 12:31:23'),
(6178, 'Administration', 'All Training Providers', 'View', '2024-04-11 12:31:28'),
(6179, 'Administration', 'All Training Providers', 'View', '2024-04-11 12:31:37'),
(6180, 'Administration', 'All Training Providers', 'View', '2024-04-11 12:31:38'),
(6181, 'Administration', 'All Training Providers', 'View', '2024-04-11 12:31:42'),
(6182, 'Administration', 'Training Providers', 'View', '2024-04-11 12:33:14'),
(6183, 'Administration', 'Training Provider', 'Upload', '2024-04-11 12:52:29'),
(6184, 'Administration', 'Training Provider', 'Upload', '2024-04-11 12:52:29'),
(6185, 'Administration', 'Training Provider', 'Upload', '2024-04-11 12:52:29'),
(6186, 'Administration', 'Training Provider', 'Upload', '2024-04-11 12:52:29'),
(6187, 'Administration', 'All Training Providers', 'View', '2024-04-11 12:52:30'),
(6188, 'Administration', 'All Training Providers', 'View', '2024-04-11 12:54:02'),
(6189, 'Administration', 'Training Provider', 'Create', '2024-04-11 12:57:35'),
(6190, 'Administration', 'All Training Providers', 'View', '2024-04-11 12:57:35'),
(6191, 'Administration', 'All Training Providers', 'View', '2024-04-11 12:59:21'),
(6192, 'Administration', 'All Training Providers', 'View', '2024-04-11 13:01:16'),
(6193, 'Administration', 'All Training Providers', 'View', '2024-04-11 13:02:52'),
(6194, 'Administration', 'Subject Matter Expert', 'View', '2024-04-11 13:02:52'),
(6195, 'Administration', 'All Training Providers', 'View', '2024-04-11 13:11:09'),
(6196, 'Administration', 'All Training Providers', 'View', '2024-04-11 13:11:09'),
(6197, 'Administration', 'All Training Providers', 'View', '2024-04-11 13:11:13'),
(6198, 'Administration', 'All Training Providers', 'View', '2024-04-11 13:11:16'),
(6199, 'Administration', 'All Training Providers', 'View', '2024-04-11 13:11:16'),
(6200, 'Administration', 'Training Providers', 'View', '2024-04-11 13:11:33'),
(6201, 'Administration', 'All Training Providers', 'View', '2024-04-11 13:11:34'),
(6202, 'Administration', 'All Training Providers', 'View', '2024-04-11 13:11:39'),
(6203, 'Administration', 'All Training Providers', 'View', '2024-04-11 13:11:39'),
(6204, 'Administration', 'Training Providers', 'View', '2024-04-11 13:11:43'),
(6205, 'Administration', 'All Training Providers', 'View', '2024-04-11 13:11:43'),
(6206, 'Administration', 'All Training Providers', 'View', '2024-04-11 13:11:46'),
(6207, 'Administration', 'All Training Providers', 'View', '2024-04-11 13:11:46'),
(6208, 'Administration', 'Training Providers', 'View', '2024-04-11 13:11:52'),
(6209, 'Administration', 'All Training Providers', 'View', '2024-04-11 13:11:52'),
(6210, 'Administration', 'All Training Providers', 'View', '2024-04-11 13:11:55'),
(6211, 'Administration', 'All Training Providers', 'View', '2024-04-11 13:11:55'),
(6212, 'Administration', 'Training Providers', 'View', '2024-04-11 13:12:01'),
(6213, 'Administration', 'All Training Providers', 'View', '2024-04-11 13:12:01'),
(6214, 'Administration', 'All Training Providers', 'View', '2024-04-11 13:12:07'),
(6215, 'Administration', 'All Training Providers', 'View', '2024-04-11 13:12:07'),
(6216, 'Administration', 'All Training Providers', 'View', '2024-04-11 13:15:32'),
(6217, 'Administration', 'All Training Providers', 'View', '2024-04-11 13:15:35'),
(6218, 'Administration', 'All Training Providers', 'View', '2024-04-11 13:15:37'),
(6219, 'Administration', 'Subject Matter Expert', 'View', '2024-04-11 13:15:37'),
(6220, 'Administration', 'Training Provider', 'Deactivate', '2024-04-11 13:15:39'),
(6221, 'Administration', 'All Training Providers', 'View', '2024-04-11 13:15:39'),
(6222, 'Administration', 'All Training Providers', 'View', '2024-04-11 13:15:43'),
(6223, 'Administration', 'All Training Providers', 'View', '2024-04-11 13:15:54'),
(6224, 'Administration', 'All Training Providers', 'View', '2024-04-11 13:15:57'),
(6225, 'Administration', 'All Training Providers', 'View', '2024-04-11 13:16:36'),
(6226, 'Administration', 'Subject Matter Expert', 'View', '2024-04-11 13:16:36'),
(6227, 'Administration', 'All Training Providers', 'View', '2024-04-11 13:21:54'),
(6228, 'Administration', 'All Training Providers', 'View', '2024-04-11 13:21:59'),
(6229, 'Administration', 'Subject Matter Expert', 'View', '2024-04-11 13:21:59'),
(6230, 'Administration', 'All Training Providers', 'View', '2024-04-11 13:25:27'),
(6231, 'Administration', 'Training Providers', 'View', '2024-04-11 13:25:41'),
(6232, 'Administration', 'Training Providers', 'View', '2024-04-11 13:26:08'),
(6233, 'Administration', 'All Training Providers', 'View', '2024-04-11 13:26:21'),
(6234, 'Administration', 'All Training Providers', 'View', '2024-04-11 13:26:23'),
(6235, 'Administration', 'Subject Matter Expert', 'View', '2024-04-11 13:26:23'),
(6236, 'Administration', 'All Training Providers', 'View', '2024-04-11 13:26:34'),
(6237, 'Administration', 'All Training Providers', 'View', '2024-04-11 13:26:35'),
(6238, 'Administration', 'Subject Matter Expert', 'View', '2024-04-11 13:26:35'),
(6239, 'Administration', 'All Training Providers', 'View', '2024-04-11 13:26:37'),
(6240, 'Administration', 'All Training Providers', 'View', '2024-04-11 13:26:40'),
(6241, 'Administration', 'Subject Matter Expert', 'View', '2024-04-11 13:26:40'),
(6242, 'Administration', 'All Training Providers', 'View', '2024-04-11 13:26:58'),
(6243, 'Administration', 'All Training Providers', 'View', '2024-04-11 13:27:07'),
(6244, 'Administration', 'All Training Providers', 'View', '2024-04-11 13:27:10'),
(6245, 'Administration', 'Subject Matter Expert', 'View', '2024-04-11 13:27:10'),
(6246, 'Administration', 'All Training Providers', 'View', '2024-04-11 13:27:15'),
(6247, 'Administration', 'All Training Providers', 'View', '2024-04-11 13:27:17'),
(6248, 'Administration', 'Subject Matter Expert', 'View', '2024-04-11 13:27:17'),
(6249, 'Administration', 'All Training Providers', 'View', '2024-04-11 13:33:53'),
(6250, 'Administration', 'All Training Providers', 'View', '2024-04-11 13:34:01'),
(6251, 'Administration', 'Subject Matter Expert', 'View', '2024-04-11 13:34:01'),
(6252, 'Administration', 'All Training Providers', 'View', '2024-04-11 13:36:04'),
(6253, 'Administration', 'All Training Providers', 'View', '2024-04-11 13:36:05'),
(6254, 'Administration', 'Subject Matter Expert', 'View', '2024-04-11 13:36:06'),
(6255, 'Administration', 'All Training Providers', 'View', '2024-04-11 13:36:07'),
(6256, 'Administration', 'All Training Providers', 'View', '2024-04-11 13:36:09'),
(6257, 'Administration', 'Subject Matter Expert', 'View', '2024-04-11 13:36:09'),
(6258, 'Administration', 'All Training Providers', 'View', '2024-04-11 13:36:14'),
(6259, 'Administration', 'All Training Providers', 'View', '2024-04-11 13:36:19'),
(6260, 'Administration', 'All Training Providers', 'View', '2024-04-11 13:36:21'),
(6261, 'Administration', 'Subject Matter Expert', 'View', '2024-04-11 13:36:21'),
(6262, 'Administration', 'All Training Providers', 'View', '2024-04-11 13:37:58'),
(6263, 'Administration', 'All Training Providers', 'View', '2024-04-11 13:37:59'),
(6264, 'Administration', 'Subject Matter Expert', 'View', '2024-04-11 13:37:59'),
(6265, 'Administration', 'All Training Providers', 'View', '2024-04-11 13:39:33'),
(6266, 'Administration', 'Subject Matter Expert', 'View', '2024-04-11 13:39:42'),
(6267, 'Administration', 'Subject Matter Expert', 'View', '2024-04-11 13:40:26'),
(6268, 'Administration', 'Subject Matter Expert', 'View', '2024-04-11 13:42:17'),
(6269, 'Administration', 'Subject Matter Expert', 'View', '2024-04-11 13:47:16'),
(6270, 'Administration', 'Subject Matter Expert', 'View', '2024-04-11 14:04:08'),
(6271, 'Administration', 'Subject Matter Expert', 'View', '2024-04-11 14:04:10'),
(6272, 'Administration', 'Subject Matter Expert', 'View', '2024-04-11 14:04:17'),
(6273, 'Administration', 'Subject Matter Expert', 'View', '2024-04-11 14:04:22'),
(6274, 'Administration', 'Training Providers', 'View', '2024-04-11 14:05:09'),
(6275, 'Administration', 'Subject Matter Expert', 'View', '2024-04-11 14:05:10'),
(6276, 'Administration', 'All Training Providers', 'View', '2024-04-11 14:05:22'),
(6277, 'Administration', 'All Training Providers', 'View', '2024-04-11 14:05:24'),
(6278, 'Administration', 'Subject Matter Expert', 'View', '2024-04-11 14:05:24'),
(6279, 'Administration', 'Subject Matter Expert', 'View', '2024-04-11 14:05:32'),
(6280, 'Administration', 'Subject Matter Expert', 'View', '2024-04-11 14:08:49'),
(6281, 'Administration', 'Subject Matter Expert', 'View', '2024-04-11 14:08:50'),
(6282, 'Administration', 'Subject Matter Expert', 'View', '2024-04-11 14:08:52'),
(6283, 'Administration', 'Subject Matter Expert', 'View', '2024-04-11 14:08:56'),
(6284, 'Administration', 'Subject Matter Expert', 'View', '2024-04-11 14:09:01'),
(6285, 'Administration', 'Subject Matter Expert', 'View', '2024-04-11 14:09:06'),
(6286, 'Administration', 'Subject Matter Expert', 'View', '2024-04-11 14:09:11'),
(6287, 'Administration', 'Subject Matter Expert', 'View', '2024-04-11 14:09:15'),
(6288, 'Administration', 'Subject Matter Expert', 'View', '2024-04-11 14:09:19'),
(6289, 'Administration', 'Subject Matter Expert', 'View', '2024-04-11 14:09:32'),
(6290, 'Administration', 'Subject Matter Expert', 'View', '2024-04-11 14:09:43'),
(6291, 'Administration', 'Training Providers', 'View', '2024-04-11 14:10:19'),
(6292, 'Administration', 'Subject Matter Expert', 'View', '2024-04-11 14:10:23'),
(6293, 'Administration', 'Subject Matter Expert', 'View', '2024-04-11 14:14:35'),
(6294, 'Administration', 'Subject Matter Expert', 'View', '2024-04-11 14:14:58'),
(6295, 'Administration', 'Training Providers', 'View', '2024-04-12 02:19:56'),
(6296, 'Administration', 'Training Providers', 'View', '2024-04-12 02:23:42'),
(6297, 'Administration', 'Training Providers', 'View', '2024-04-12 02:42:31'),
(6298, 'Administration', 'Training Providers', 'View', '2024-04-12 02:43:15'),
(6299, 'Administration', 'Training Providers', 'View', '2024-04-12 02:44:39'),
(6300, 'Administration', 'Training Providers', 'View', '2024-04-12 03:10:03'),
(6301, 'Administration', 'Training Providers', 'View', '2024-04-12 03:10:24'),
(6302, 'Administration', 'Training Providers', 'View', '2024-04-12 03:18:20'),
(6303, 'Administration', 'Training Providers', 'View', '2024-04-12 03:38:26'),
(6304, 'Administration', 'Training Providers', 'View', '2024-04-12 03:38:42'),
(6305, 'Administration', 'Training Providers', 'View', '2024-04-12 03:38:55'),
(6306, 'Administration', 'Training Providers', 'View', '2024-04-12 03:39:25'),
(6307, 'Administration', 'Training Providers', 'View', '2024-04-12 03:39:28'),
(6308, 'Administration', 'Training Providers', 'View', '2024-04-12 03:39:35'),
(6309, 'Administration', 'Training Providers', 'View', '2024-04-12 03:40:34'),
(6310, 'Administration', 'Training Providers', 'View', '2024-04-12 03:41:02'),
(6311, 'Administration', 'Training Providers', 'View', '2024-04-12 04:48:00'),
(6312, 'Administration', 'Training Providers', 'View', '2024-04-12 04:50:38'),
(6313, 'Administration', 'Training Providers', 'View', '2024-04-12 04:53:16'),
(6314, 'Administration', 'Training Providers', 'View', '2024-04-12 04:54:07'),
(6315, 'Administration', 'Training Providers', 'View', '2024-04-13 05:45:59'),
(6316, 'Administration', 'Training Providers', 'View', '2024-04-13 05:48:01'),
(6317, 'Administration', 'Training Providers', 'View', '2024-04-13 05:50:41'),
(6318, 'Administration', 'Training Providers', 'View', '2024-04-13 05:54:29'),
(6319, 'Administration', 'Training Providers', 'View', '2024-04-13 05:55:22'),
(6320, 'Administration', 'Training Providers', 'View', '2024-04-13 05:57:34'),
(6321, 'Administration', 'Training Providers', 'View', '2024-04-13 06:00:55'),
(6322, 'Administration', 'Training Providers', 'View', '2024-04-13 06:03:23'),
(6323, 'Administration', 'Training Providers', 'View', '2024-04-13 06:04:59'),
(6324, 'Administration', 'Training Providers', 'View', '2024-04-13 06:05:47'),
(6325, 'Administration', 'Training Providers', 'View', '2024-04-13 06:06:13'),
(6326, 'Administration', 'Training Providers', 'View', '2024-04-13 06:23:58'),
(6327, 'Administration', 'Training Providers', 'View', '2024-04-13 10:21:10'),
(6328, 'Administration', 'Training Providers', 'View', '2024-04-13 10:25:18'),
(6329, 'Administration', 'Training Providers', 'View', '2024-04-13 10:26:21'),
(6330, 'Administration', 'Training Providers', 'View', '2024-04-13 10:27:24'),
(6331, 'Administration', 'Training Providers', 'View', '2024-04-13 10:27:29'),
(6332, 'Administration', 'Training Providers', 'View', '2024-04-13 10:29:34'),
(6333, 'Administration', 'Training Providers', 'View', '2024-04-13 10:30:51'),
(6334, 'Administration', 'Training Providers', 'View', '2024-04-13 10:31:34'),
(6335, 'Administration', 'Training Providers', 'View', '2024-04-13 10:32:33'),
(6336, 'Administration', 'Training Providers', 'View', '2024-04-13 10:34:03'),
(6337, 'Administration', 'Training Providers', 'View', '2024-04-13 10:35:16'),
(6338, 'Administration', 'Training Providers', 'View', '2024-04-13 10:36:04'),
(6339, 'Administration', 'Training Providers', 'View', '2024-04-13 10:36:12'),
(6340, 'Administration', 'Training Providers', 'View', '2024-04-13 10:37:15'),
(6341, 'Administration', 'Training Providers', 'View', '2024-04-13 10:37:22'),
(6342, 'Administration', 'Training Providers', 'View', '2024-04-13 10:39:32'),
(6343, 'Administration', 'Training Providers', 'View', '2024-04-13 10:40:49'),
(6344, 'Administration', 'Training Providers', 'View', '2024-04-13 10:41:13'),
(6345, 'Administration', 'All Training Providers', 'View', '2024-04-14 02:45:07'),
(6346, 'Administration', 'Subject Matter Expert', 'View', '2024-04-14 02:46:15'),
(6347, 'Administration', 'All Training Providers', 'View', '2024-04-14 02:46:15'),
(6348, 'Administration', 'All Training Providers', 'View', '2024-04-14 02:46:53'),
(6349, 'Administration', 'All Training Providers', 'View', '2024-04-14 02:48:41'),
(6350, 'Administration', 'All Training Providers', 'View', '2024-04-14 02:48:44'),
(6351, 'Administration', 'Subject Matter Expert', 'View', '2024-04-14 02:48:44'),
(6352, 'Administration', 'All Training Providers', 'View', '2024-04-14 02:49:07'),
(6353, 'Administration', 'Training Providers', 'View', '2024-04-14 03:03:29'),
(6354, 'Administration', 'All Training Providers', 'View', '2024-04-14 03:08:08'),
(6355, 'Administration', 'All Training Providers', 'View', '2024-04-14 03:09:02'),
(6356, 'Administration', 'Training Providers', 'View', '2024-04-14 03:11:29'),
(6357, 'Administration', 'Training Providers', 'View', '2024-04-14 12:40:18'),
(6358, 'Administration', 'Training Providers', 'View', '2024-04-14 13:08:20'),
(6359, 'Administration', 'Training Providers', 'View', '2024-04-14 13:11:05'),
(6360, 'Administration', 'Registration', 'View', '2024-04-14 14:01:53'),
(6361, 'Administration', 'Registration', 'View', '2024-04-14 14:01:53'),
(6362, 'Administration', 'Registration', 'View', '2024-04-14 14:01:53'),
(6363, 'Administration', 'Registration', 'View', '2024-04-14 14:01:53'),
(6364, 'Administration', 'Registration', 'View', '2024-04-14 14:01:57'),
(6365, 'Administration', 'Registration', 'View', '2024-04-14 14:01:57'),
(6366, 'Administration', 'Registration', 'View', '2024-04-14 14:01:57'),
(6367, 'Administration', 'Registration', 'View', '2024-04-14 14:01:57'),
(6368, 'Administration', 'Training Providers', 'View', '2024-04-15 01:35:38'),
(6369, 'Administration', 'Training Providers', 'View', '2024-04-16 08:08:28'),
(6370, 'Administration', 'All Training Providers', 'View', '2024-04-16 08:11:13'),
(6371, 'Administration', 'Subject Matter Expert', 'View', '2024-04-16 08:11:51'),
(6372, 'Administration', 'All Training Providers', 'View', '2024-04-16 08:11:51'),
(6373, 'Administration', 'All Training Providers', 'View', '2024-04-16 08:13:32'),
(6374, 'Administration', 'All Training Providers', 'View', '2024-04-16 08:13:42'),
(6375, 'Administration', 'All Training Providers', 'View', '2024-04-16 08:13:43'),
(6376, 'Administration', 'Subject Matter Expert', 'View', '2024-04-16 08:13:43'),
(6377, 'Administration', 'Training Providers', 'View', '2024-04-16 08:13:59'),
(6378, 'Administration', 'Training Providers', 'View', '2024-04-16 08:15:11'),
(6379, 'Administration', 'Training Providers', 'View', '2024-04-16 08:32:11'),
(6380, 'Administration', 'All Training Providers', 'View', '2024-04-16 11:09:29'),
(6381, 'Administration', 'All Training Providers', 'View', '2024-04-17 02:43:37'),
(6382, 'Administration', 'Training Provider', 'Create', '2024-04-17 02:46:37'),
(6383, 'Administration', 'All Training Providers', 'View', '2024-04-17 02:46:37'),
(6384, 'Administration', 'All Training Providers', 'View', '2024-04-17 02:46:47'),
(6385, 'Administration', 'All Training Providers', 'View', '2024-04-17 02:46:54'),
(6386, 'Administration', 'Training Provider', 'Create', '2024-04-17 02:48:40'),
(6387, 'Administration', 'All Training Providers', 'View', '2024-04-17 02:48:40'),
(6388, 'Administration', 'Subject Matter Expert', 'View', '2024-04-17 02:50:02'),
(6389, 'Administration', 'All Training Providers', 'View', '2024-04-17 02:50:02'),
(6390, 'Administration', 'All Training Providers', 'View', '2024-04-17 02:50:05'),
(6391, 'Administration', 'All Training Providers', 'View', '2024-04-17 02:50:05'),
(6392, 'Administration', 'Training Providers', 'View', '2024-04-17 02:50:13'),
(6393, 'Administration', 'All Training Providers', 'View', '2024-04-17 02:50:13'),
(6394, 'Administration', 'All Training Providers', 'View', '2024-04-17 02:50:45'),
(6395, 'Administration', 'All Training Providers', 'View', '2024-04-17 02:50:47'),
(6396, 'Administration', 'Subject Matter Expert', 'View', '2024-04-17 02:50:47'),
(6397, 'Administration', 'All Training Providers', 'View', '2024-04-17 02:50:50'),
(6398, 'Administration', 'All Training Providers', 'View', '2024-04-17 02:50:52'),
(6399, 'Administration', 'Subject Matter Expert', 'View', '2024-04-17 02:50:52'),
(6400, 'Administration', 'Training Providers', 'View', '2024-04-17 03:17:19'),
(6401, 'Administration', 'Training Providers', 'View', '2024-04-17 03:17:41'),
(6402, 'Administration', 'All Training Providers', 'View', '2024-04-17 03:17:55'),
(6403, 'Administration', 'All Training Providers', 'View', '2024-04-17 03:17:59'),
(6404, 'Administration', 'Subject Matter Expert', 'View', '2024-04-17 03:17:59'),
(6405, 'Administration', 'All Training Providers', 'View', '2024-04-17 03:18:03'),
(6406, 'Administration', 'All Training Providers', 'View', '2024-04-17 03:24:07'),
(6407, 'Administration', 'Subject Matter Expert', 'View', '2024-04-17 03:24:07'),
(6408, 'Administration', 'All Training Providers', 'View', '2024-04-17 03:24:09'),
(6409, 'Administration', 'Training Providers', 'View', '2024-04-17 03:24:18'),
(6410, 'Administration', 'Training Providers', 'View', '2024-04-17 03:38:16'),
(6411, 'Administration', 'Training Providers', 'View', '2024-04-17 04:03:25');

-- --------------------------------------------------------

--
-- Table structure for table `availability`
--

CREATE TABLE `availability` (
  `availID` int(7) NOT NULL,
  `provID` int(7) NOT NULL,
  `pprogID` int(7) NOT NULL,
  `dateFrom` date NOT NULL DEFAULT '0000-00-00',
  `fromTime` time NOT NULL DEFAULT '00:00:00',
  `dateTo` date NOT NULL DEFAULT '0000-00-00',
  `toTime` time NOT NULL DEFAULT '00:00:00',
  `createdOn` datetime NOT NULL DEFAULT current_timestamp(),
  `disabledOn` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `status` enum('Available','Not Available') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `availability`
--

INSERT INTO `availability` (`availID`, `provID`, `pprogID`, `dateFrom`, `fromTime`, `dateTo`, `toTime`, `createdOn`, `disabledOn`, `status`) VALUES
(5, 29, 27, '2023-02-10', '08:00:00', '2023-02-11', '16:00:00', '2023-04-10 17:54:43', '0000-00-00 00:00:00', 'Available'),
(6, 29, 27, '2023-02-10', '05:00:00', '2023-02-11', '13:00:00', '2023-04-10 17:56:35', '0000-00-00 00:00:00', 'Available'),
(7, 28, 27, '2023-02-10', '08:00:00', '2023-02-11', '16:00:00', '2023-04-10 17:57:00', '0000-00-00 00:00:00', 'Available'),
(8, 34, 26, '2024-04-01', '09:00:00', '2024-04-04', '17:00:00', '2024-04-14 21:11:21', '0000-00-00 00:00:00', 'Available'),
(9, 34, 26, '2024-04-01', '12:00:00', '2024-04-25', '20:00:00', '2024-04-14 21:20:37', '0000-00-00 00:00:00', 'Available'),
(10, 34, 29, '2024-04-30', '09:00:00', '2024-05-16', '17:00:00', '2024-04-15 09:36:41', '0000-00-00 00:00:00', 'Available'),
(11, 34, 26, '2024-04-15', '09:00:00', '2024-04-15', '13:00:00', '2024-04-16 16:24:31', '0000-00-00 00:00:00', 'Available'),
(12, 34, 26, '2024-04-29', '09:00:00', '2024-04-29', '20:00:00', '2024-04-16 16:32:02', '0000-00-00 00:00:00', 'Available'),
(13, 34, 26, '2024-04-29', '11:00:00', '2024-04-29', '12:00:00', '2024-04-16 16:32:36', '0000-00-00 00:00:00', 'Available'),
(14, 34, 26, '2024-04-22', '09:00:00', '2024-04-22', '10:00:00', '2024-04-16 16:33:05', '0000-00-00 00:00:00', 'Available'),
(15, 28, 26, '2024-04-29', '09:00:00', '2024-04-29', '11:00:00', '2024-04-16 16:33:08', '0000-00-00 00:00:00', 'Available'),
(16, 28, 26, '2024-03-31', '09:00:00', '2024-04-08', '11:00:00', '2024-04-16 16:34:22', '0000-00-00 00:00:00', 'Available'),
(17, 28, 26, '2024-04-01', '09:00:00', '2024-04-04', '09:00:00', '2024-04-16 16:35:04', '0000-00-00 00:00:00', 'Available'),
(18, 34, 30, '2024-04-01', '09:00:00', '2024-04-04', '09:00:00', '2024-04-16 16:50:14', '0000-00-00 00:00:00', 'Available');

-- --------------------------------------------------------

--
-- Table structure for table `certificates`
--

CREATE TABLE `certificates` (
  `certID` int(7) NOT NULL,
  `empID` int(7) NOT NULL,
  `programName` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `trainingprovider` varchar(255) NOT NULL,
  `type` enum('Internal','External','In-house','Self-initiated') NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date NOT NULL,
  `pdf_content` blob NOT NULL,
  `createdOn` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `cert_status` enum('For Verification','Verified','Rejected') DEFAULT 'For Verification'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `certificates`
--

INSERT INTO `certificates` (`certID`, `empID`, `programName`, `description`, `trainingprovider`, `type`, `startDate`, `endDate`, `pdf_content`, `createdOn`, `cert_status`) VALUES
(11, 1, 'National Certification III', 'NC III Web Development', 'TESDA', 'Self-initiated', '2018-09-02', '2018-09-03', 0x5b6f626a65637420426c6f625d, '2024-03-11 06:15:54', 'Verified'),
(12, 1, 'National Certification III', 'NC III Web Development', 'TESDA', 'Self-initiated', '2018-09-02', '2018-09-03', 0x5b6f626a65637420426c6f625d, '2024-03-11 06:18:46', 'Verified'),
(13, 1, 'undefined', 'undefined', 'undefined', '', '0000-00-00', '0000-00-00', 0x5b6f626a65637420426c6f625d, '2023-09-28 12:51:52', 'For Verification'),
(14, 1, 'National Certification III', 'NC III Web Development', 'TESDA', 'Self-initiated', '2018-09-02', '2018-09-03', 0x5b6f626a65637420426c6f625d, '2023-09-28 12:54:38', 'For Verification'),
(15, 1, 'undefined', 'undefined', 'undefined', 'Self-initiated', '0000-00-00', '0000-00-00', 0x5b6f626a65637420426c6f625d, '2023-09-28 12:56:06', 'For Verification'),
(16, 1, 'qwertyu', 'qwertyu', 'qwertyui', 'Self-initiated', '2023-09-27', '2023-09-29', 0x5b6f626a65637420426c6f625d, '2023-09-28 12:57:57', 'For Verification'),
(17, 1, 'National Certification III', 'NC III Web Development', 'TESDA', 'Self-initiated', '2018-09-02', '2018-09-03', 0x5b6f626a65637420426c6f625d, '2024-03-11 06:51:03', 'Verified'),
(18, 1, 'sample data', 'sample description', 'training prvoder', 'Self-initiated', '2023-10-07', '2023-10-13', 0x5b6f626a65637420426c6f625d, '2024-03-11 06:24:07', 'Verified'),
(19, 5, 'Test ProgName', 'Test Desc', 'Test Provider', 'Self-initiated', '2023-11-04', '2023-11-06', '', '2024-03-11 06:23:29', 'Verified'),
(20, 1, 'ISO Lead Risk Manager', 'ISO Lead Risk Manager Certificate', 'PECB', 'Self-initiated', '2024-03-10', '2024-03-10', 0x5b6f626a65637420426c6f625d, '2024-03-11 06:29:43', 'Verified'),
(21, 1, 'jhkjasgbgddsgjh', 'dsgjrngrio', 'dsnkgeorrno reg', 'Self-initiated', '2024-03-10', '2024-03-27', 0x5b6f626a65637420426c6f625d, '2024-03-11 08:07:35', 'For Verification'),
(22, 1, 'test', 'teststs', 'test', 'Self-initiated', '2024-03-19', '2024-03-27', 0x756e646566696e6564, '2024-03-11 08:15:24', 'For Verification');

-- --------------------------------------------------------

--
-- Table structure for table `competency_planned`
--

CREATE TABLE `competency_planned` (
  `compID` int(7) NOT NULL,
  `pID` int(7) NOT NULL,
  `targetDate` date DEFAULT NULL,
  `compStatus` enum('Pending','For L&D Approval','Rejected by L&D','For ALDP','Approved','Served','Unserved') NOT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `createdOn` timestamp NOT NULL DEFAULT current_timestamp(),
  `disabledOn` datetime DEFAULT NULL,
  `updatedOn` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `competency_planned`
--

INSERT INTO `competency_planned` (`compID`, `pID`, `targetDate`, `compStatus`, `remarks`, `createdOn`, `disabledOn`, `updatedOn`) VALUES
(13, 2, NULL, 'For ALDP', NULL, '2023-10-04 10:28:20', NULL, NULL),
(14, 2, NULL, 'For ALDP', NULL, '2023-10-04 10:28:20', NULL, NULL),
(15, 2, NULL, 'For ALDP', NULL, '2023-10-04 10:28:20', NULL, NULL),
(16, 3, NULL, 'For ALDP', NULL, '2023-10-04 10:30:36', NULL, NULL),
(17, 1, NULL, 'For ALDP', NULL, '2023-10-05 09:29:03', NULL, NULL),
(18, 1, NULL, 'For ALDP', NULL, '2023-10-06 01:51:31', NULL, NULL),
(19, 2, NULL, 'For ALDP', NULL, '2023-10-06 03:40:54', NULL, NULL),
(20, 1, NULL, 'For ALDP', NULL, '2023-10-06 03:54:53', NULL, NULL),
(21, 2, NULL, 'For ALDP', NULL, '2023-10-06 03:54:58', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `competency_unplanned`
--

CREATE TABLE `competency_unplanned` (
  `reqID` int(7) NOT NULL,
  `empID` int(7) NOT NULL,
  `specificLDNeeds` varchar(100) NOT NULL,
  `levelOfProficiency` enum('Beginner','Intermediate','Advanced') NOT NULL,
  `reqStatus` enum('For Division Chief Approval','Rejected by Division Chief','For L&D Approval','Rejected by L&D','Approved','Served','Unserved') NOT NULL,
  `reqRemarks` varchar(255) DEFAULT NULL,
  `createdOn` timestamp NOT NULL DEFAULT current_timestamp(),
  `disabledOn` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updatedOn` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `compreq_competencies`
--

CREATE TABLE `compreq_competencies` (
  `ccID` int(7) NOT NULL,
  `compID` int(7) NOT NULL,
  `reqID` int(7) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `division`
--

CREATE TABLE `division` (
  `divID` int(7) NOT NULL,
  `divisionName` varchar(100) NOT NULL,
  `divisionChief` varchar(100) NOT NULL,
  `createdOn` timestamp NOT NULL DEFAULT current_timestamp(),
  `disabledOn` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updatedOn` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE current_timestamp(),
  `divStatus` enum('Active','Inactive') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `division`
--

INSERT INTO `division` (`divID`, `divisionName`, `divisionChief`, `createdOn`, `disabledOn`, `updatedOn`, `divStatus`) VALUES
(1, 'Admin', 'Admin', '2023-03-23 09:03:56', '0000-00-00 00:00:00', '2023-03-23 09:04:30', 'Active'),
(2, 'Learning and Development', 'Marlene Rafanan', '2023-03-23 09:36:56', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Active');

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `empID` int(7) NOT NULL,
  `employeeNo` int(7) NOT NULL,
  `divID` int(5) NOT NULL,
  `lastname` varchar(20) NOT NULL,
  `firstname` varchar(50) NOT NULL,
  `middlename` varchar(20) DEFAULT NULL,
  `emailAddress` varchar(100) NOT NULL,
  `gender` enum('Female','Male') NOT NULL,
  `employmentStat` enum('Contractual','Probationary','Regular','Resigned','Retracted') NOT NULL,
  `position` varchar(100) NOT NULL,
  `salaryGrade` varchar(50) DEFAULT NULL,
  `birthday` date NOT NULL,
  `religion` varchar(100) DEFAULT NULL,
  `specialNeeds` enum('PWD','Immuno-Compromised','None') NOT NULL,
  `createdOn` timestamp NOT NULL DEFAULT current_timestamp(),
  `deactivatedOn` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `lastUpdateOn` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE current_timestamp(),
  `status` enum('Active','Inactive') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`empID`, `employeeNo`, `divID`, `lastname`, `firstname`, `middlename`, `emailAddress`, `gender`, `employmentStat`, `position`, `salaryGrade`, `birthday`, `religion`, `specialNeeds`, `createdOn`, `deactivatedOn`, `lastUpdateOn`, `status`) VALUES
(1, 0, 1, 'Admin', 'Admin', ' ', '', 'Male', 'Regular', 'Admin', 'N/A', '1995-01-23', 'Not Applicable', 'None', '2023-03-23 09:11:34', '0000-00-00 00:00:00', '2023-03-27 06:05:54', 'Active'),
(2, 1, 2, 'Rafanan', 'Marlene', NULL, '', 'Female', 'Regular', 'Head', NULL, '0000-00-00', NULL, 'None', '2023-03-24 05:50:33', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Active');

-- --------------------------------------------------------

--
-- Table structure for table `forms`
--

CREATE TABLE `forms` (
  `formID` int(11) NOT NULL,
  `AldpID` int(11) DEFAULT NULL,
  `type` enum('Feedback for Facilitator','Feedback for Speaker','Feedback for Program','Pre-Test','Post-Test') DEFAULT NULL,
  `createdOn` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedOn` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `forms_content`
--

CREATE TABLE `forms_content` (
  `contentID` int(11) NOT NULL,
  `formID` int(11) DEFAULT NULL,
  `type` enum('radio','textbox','checkbox') DEFAULT NULL,
  `label` varchar(255) DEFAULT NULL,
  `required` tinyint(1) DEFAULT NULL,
  `correct_answer` varchar(255) DEFAULT NULL,
  `createdOn` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedOn` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `forms_options`
--

CREATE TABLE `forms_options` (
  `optionsID` int(11) NOT NULL,
  `contentID` int(11) DEFAULT NULL,
  `option_value` varchar(255) DEFAULT NULL,
  `createdOn` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedOn` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `forms_registration`
--

CREATE TABLE `forms_registration` (
  `formRegID` int(7) NOT NULL,
  `aldpID` int(7) NOT NULL,
  `empID` int(7) NOT NULL,
  `consent` enum('Yes','No') NOT NULL,
  `type` enum('Local','Foreign') NOT NULL,
  `classification` enum('Technical','Non-Technical') NOT NULL,
  `createdOn` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `disabledOn` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updatedOn` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `paymentopt`
--

CREATE TABLE `paymentopt` (
  `paymentOptID` int(7) NOT NULL,
  `payee` varchar(100) NOT NULL,
  `accountNo` varchar(15) NOT NULL,
  `provID` int(7) NOT NULL,
  `ddPaymentOpt` enum('Cash','Bank','E-wallet') DEFAULT NULL,
  `bankName` varchar(100) NOT NULL,
  `TIN` varchar(12) DEFAULT NULL,
  `status` enum('Active','Inactive') NOT NULL,
  `createdOn` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `disabledOn` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updatedOn` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `paymentopt`
--

INSERT INTO `paymentopt` (`paymentOptID`, `payee`, `accountNo`, `provID`, `ddPaymentOpt`, `bankName`, `TIN`, `status`, `createdOn`, `disabledOn`, `updatedOn`) VALUES
(19, 'SitesPhil Incorporated', '6546813214', 29, 'Bank', 'Unionbank', '888888544444', 'Active', '2023-11-24 05:25:59', '2023-11-24 05:25:54', '2023-11-24 05:25:59'),
(20, 'SP Inc', '01234567', 28, 'E-wallet', 'SP Inc', '89798546845', 'Active', '2023-11-17 06:05:26', '2023-11-17 06:05:22', '2023-11-17 06:05:26'),
(21, 'Test Payee', '099999999999999', 32, 'Bank', 'UnionBank', '88888888888', 'Active', '2024-03-01 02:19:14', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(22, 'BeeTheThese Inc', '09584565856', 34, 'E-wallet', 'Beverly Dadis', '999999999999', 'Active', '2024-04-11 09:41:59', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(23, 'IT Consulting Firm', '09584565856', 39, 'E-wallet', 'Jomark Albert', '555555555555', 'Active', '2024-04-11 13:22:07', '0000-00-00 00:00:00', '2024-04-11 13:22:07'),
(24, 'Jahsgbjdu as', '566666666666', 39, 'Bank', 'UnionBank', '088888888888', 'Active', '2024-04-11 13:24:47', '2024-04-11 13:24:28', '2024-04-11 13:24:47');

-- --------------------------------------------------------

--
-- Table structure for table `providerprogram`
--

CREATE TABLE `providerprogram` (
  `pprogID` int(7) NOT NULL,
  `programName` varchar(100) NOT NULL,
  `description` varchar(255) NOT NULL,
  `status` enum('Available','Not Available','Availed','Cancelled') NOT NULL,
  `addedOn` timestamp NOT NULL DEFAULT current_timestamp(),
  `notAvailOn` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updatedOn` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `providerprogram`
--

INSERT INTO `providerprogram` (`pprogID`, `programName`, `description`, `status`, `addedOn`, `notAvailOn`, `updatedOn`) VALUES
(26, 'Comptia ITF', 'IT Fundamentals', 'Available', '2023-03-30 06:31:29', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(27, 'Comptia ITF Plus', 'Fundamentals of IT', 'Available', '2023-03-30 07:37:02', '0000-00-00 00:00:00', '2023-04-08 11:49:21'),
(28, 'Eme', 'eme', 'Available', '2024-02-23 06:32:14', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(29, 'Mile Two Certified Ethical Hacker', 'Certified Ethical Hacker', 'Available', '2024-03-01 02:01:35', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(30, 'Information Security Awareness', 'Fundamentals of InfoSec', 'Available', '2024-04-11 09:42:49', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(31, 'Test Program', 'for testing', 'Available', '2024-04-11 09:48:07', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(32, 'Testting ', 'test', 'Available', '2024-04-11 09:54:49', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(33, 'adddddddd', 'adddddd', 'Available', '2024-04-11 09:55:51', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(34, 'aaaaaaaaa', 'aaaaaaaaaaaaaaaa', 'Available', '2024-04-11 09:59:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(35, 'More Testing', 'testing ulit', 'Available', '2024-04-11 10:00:14', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(36, 'test ulit', 'test', 'Available', '2024-04-12 03:10:38', '0000-00-00 00:00:00', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `resourcespeaker`
--

CREATE TABLE `resourcespeaker` (
  `rsID` int(7) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `firstName` varchar(50) NOT NULL,
  `middleName` varchar(50) DEFAULT NULL,
  `companyName` varchar(100) DEFAULT NULL,
  `telNo` varchar(15) NOT NULL,
  `mobileNo` varchar(15) NOT NULL,
  `website` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `fbMessenger` varchar(100) DEFAULT NULL,
  `viberNo` varchar(15) NOT NULL,
  `areaOfExpertise` varchar(100) NOT NULL,
  `honoraria` decimal(10,0) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `scholarship`
--

CREATE TABLE `scholarship` (
  `runningNo` int(7) NOT NULL,
  `employeeNo` int(7) NOT NULL,
  `degreeProgram` enum('Doctorate','Masters') NOT NULL,
  `type` enum('Foreign','Local') NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `firstname` varchar(50) NOT NULL,
  `middlename` varchar(50) NOT NULL,
  `durationOfContract` varchar(50) DEFAULT NULL,
  `extension` varchar(50) DEFAULT NULL,
  `schoolUniversity` varchar(100) NOT NULL,
  `grantor` varchar(100) DEFAULT NULL,
  `remarks` varchar(200) DEFAULT NULL,
  `status` enum('Pending','On-hold','On-going','Completed') DEFAULT NULL,
  `createdOn` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updatedOn` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `scholarshiprequest`
--

CREATE TABLE `scholarshiprequest` (
  `sreqID` int(7) NOT NULL,
  `empID` int(7) NOT NULL,
  `type` enum('Local','Foreign') NOT NULL,
  `degree` enum('Masteral','Doctorate') DEFAULT NULL,
  `fieldOfStudy` varchar(100) NOT NULL,
  `preferredSchool` varchar(100) NOT NULL,
  `academicYear` year(4) NOT NULL,
  `sreqStatus` enum('Withdrawn by requester','For Division Chief Approval','Rejected by Division Chief','For L&D Approval','Rejected by L&D','Approved','On-going','On-hold','Completed') DEFAULT NULL,
  `createdOn` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `disabledOn` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updatedOn` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `reqRemarks` varchar(100) NOT NULL DEFAULT '''---'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sme_affiliation`
--

CREATE TABLE `sme_affiliation` (
  `affilID` int(7) NOT NULL,
  `profileID` int(7) NOT NULL,
  `orgName` varchar(100) NOT NULL,
  `memberSince` year(4) NOT NULL,
  `role` varchar(50) NOT NULL,
  `status` enum('Active','Inactive') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sme_educbackground`
--

CREATE TABLE `sme_educbackground` (
  `educID` int(7) NOT NULL,
  `profileID` int(7) NOT NULL,
  `degree` enum('Undergraduate','Master','Doctor') NOT NULL,
  `program` varchar(100) NOT NULL,
  `SYstart` year(4) NOT NULL,
  `SYend` year(4) NOT NULL,
  `status` enum('Completed','On-going','On-hold') DEFAULT NULL,
  `SStatus` enum('Active','Inactive') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sme_expertprofile`
--

CREATE TABLE `sme_expertprofile` (
  `profileID` int(7) NOT NULL,
  `provID` int(7) NOT NULL DEFAULT 1,
  `lastname` varchar(50) NOT NULL,
  `firstname` varchar(50) NOT NULL,
  `middlename` varchar(50) DEFAULT NULL,
  `mobileNo` varchar(100) NOT NULL,
  `telNo` varchar(100) NOT NULL,
  `companyName` varchar(100) NOT NULL,
  `companyAddress` varchar(100) NOT NULL DEFAULT 'Address Not Found',
  `companyNo` varchar(100) NOT NULL,
  `emailAdd` varchar(100) NOT NULL,
  `fbMessenger` varchar(50) DEFAULT NULL,
  `viberAccount` varchar(15) NOT NULL,
  `website` varchar(100) DEFAULT NULL,
  `areaOfExpertise` varchar(100) NOT NULL,
  `affiliation` varchar(255) DEFAULT NULL,
  `resource` enum('Internal','External') DEFAULT NULL,
  `honorariaRate` decimal(10,0) NOT NULL,
  `TIN` varchar(12) NOT NULL,
  `status` enum('Active','Inactive') NOT NULL,
  `createdOn` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `disabledOn` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updatedOn` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sme_expertprofile`
--

INSERT INTO `sme_expertprofile` (`profileID`, `provID`, `lastname`, `firstname`, `middlename`, `mobileNo`, `telNo`, `companyName`, `companyAddress`, `companyNo`, `emailAdd`, `fbMessenger`, `viberAccount`, `website`, `areaOfExpertise`, `affiliation`, `resource`, `honorariaRate`, `TIN`, `status`, `createdOn`, `disabledOn`, `updatedOn`) VALUES
(35, 28, 'Alber', 'Jhomarkssss', 'B', '77777777777', '09938591829', 'Sophies Information Technology Inc', 'Unit G Cestro Residences Alma Mater Street Barangay Marawoy Lipa Batangas', '77777777777', 'Unit G Cestro Residences Alma Mater Street Barangay Marawoy Lipa Batangas', 'ajfsfh jakf', '77777777777', 'kfjfkufu.com', 'InfoSec', '', 'External', 5000, '999999999999', 'Active', '2023-11-24 05:52:05', '2023-11-24 05:52:00', '2023-11-24 05:52:05');

-- --------------------------------------------------------

--
-- Table structure for table `sme_program`
--

CREATE TABLE `sme_program` (
  `spID` int(7) NOT NULL,
  `profileID` int(7) NOT NULL,
  `pprogID` int(7) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `trainingprovider`
--

CREATE TABLE `trainingprovider` (
  `provID` int(7) NOT NULL,
  `providerName` varchar(100) NOT NULL,
  `pointofContact` varchar(100) NOT NULL DEFAULT '-------',
  `address` varchar(100) NOT NULL DEFAULT '-------',
  `website` varchar(100) NOT NULL DEFAULT '-------',
  `telNo` varchar(255) NOT NULL DEFAULT '-------',
  `mobileNo` varchar(255) NOT NULL DEFAULT '-------',
  `emailAdd` varchar(100) NOT NULL DEFAULT '-------',
  `status` enum('Active','Inactive') NOT NULL DEFAULT 'Active',
  `createdOn` timestamp NOT NULL DEFAULT current_timestamp(),
  `disabledOn` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updatedOn` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `trainingprovider`
--

INSERT INTO `trainingprovider` (`provID`, `providerName`, `pointofContact`, `address`, `website`, `telNo`, `mobileNo`, `emailAdd`, `status`, `createdOn`, `disabledOn`, `updatedOn`) VALUES
(28, 'Sophies Information Technology Services', 'Reymart Castillo', 'Lipa City', 'sitesphil.com', '04377427', '04377427', 'info@sitesphil.com', 'Active', '2023-03-30 06:28:23', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(29, 'Sites Inc.', 'Jeremie Gariando', 'Lipa City', 'sitesphilincorporated.com', '04377427,04377427', '09999999999,09888888888', 'info@sitesphil.com', 'Active', '2023-03-30 07:33:03', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(30, 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'Active', '2023-11-24 03:09:33', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(31, 'Nyalmer', 'Jalber', 'Lipa City', 'nyalmer.com', '09999999999', '09999999999', 'nyalmer@gmail.com', 'Active', '2023-11-24 03:10:31', '2023-11-24 05:29:37', '2023-11-24 05:36:18'),
(32, 'Tesda', 'Kimcarl Buban', 'Lipa City, Batangas', 'tesda.net', '0439854875', '09584584569', 'kimcarl@tesda.com', 'Active', '2024-03-01 01:59:57', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(33, 'DOST MIRDC', 'Kimcarl Buban', 'Quezon City, Philippines', 'dost.email.com', '0432548545', '0996476476', 'dost@email.com', 'Active', '2024-03-01 02:21:22', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(34, 'BeeTheThese Inc.', 'Beverly Dadis', 'Lipa City, Batangas', 'beebeethee.com', '0435685496', '0995845685', 'beebeethethese@email.com', 'Active', '2024-04-11 09:40:58', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(35, 'Test5', 'Jhomark Alber', 'Laguna, Philippines', 'jhomark.com', '9995588741', '96584525485', 'jhomark@sampleimport.com', 'Active', '2024-04-11 12:52:29', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(36, 'Test6', 'Jhomar Custodio', '', 'jhomar.com', '9995588741', '', 'jhomar@sampleimport.com', 'Active', '2024-04-11 12:52:29', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(37, 'Test7', 'Beverly Dadis', 'Paranaque City', 'bevs.tv.com', '9995588741', '96584525485', 'bevsss@sampleimport.com', 'Active', '2024-04-11 12:52:29', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(38, 'Test8', 'Beverly Dadis', 'Paranaque City', 'bevs.tv.com', '9995588741', '96584525485', 'bevsss@sampleimport.com', 'Inactive', '2024-04-11 12:52:29', '2024-04-11 13:15:39', '2024-04-11 13:15:39'),
(39, 'IT Consulting Firm', 'Jomark Alber', 'Paranaque City, Metro Manila', 'ITConsultUs.com', '0434586584', '09999999999', 'jhomark@email.com', 'Active', '2024-04-11 12:57:35', '0000-00-00 00:00:00', '2024-04-11 13:12:01'),
(40, 'Tesda Center', 'Jimuel Encarnacion', 'Dasmarinas, Cavite', 'tesda.sample.com', '44444444444', '09995845658', 'tesdasample@email.com', 'Active', '2024-04-17 02:48:40', '0000-00-00 00:00:00', '2024-04-17 02:50:13');

-- --------------------------------------------------------

--
-- Table structure for table `trainingprovider_program`
--

CREATE TABLE `trainingprovider_program` (
  `tpID` int(7) NOT NULL,
  `provID` int(7) NOT NULL,
  `pprogID` int(7) NOT NULL,
  `cost` decimal(10,0) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `trainingprovider_program`
--

INSERT INTO `trainingprovider_program` (`tpID`, `provID`, `pprogID`, `cost`) VALUES
(13, 28, 26, 5000),
(14, 29, 27, 6500),
(15, 28, 28, 2000),
(25, 34, 26, 30000),
(26, 28, 36, 3000),
(33, 29, 26, 2000),
(34, 34, 29, 9999999999),
(35, 34, 34, 50500),
(36, 34, 30, 100),
(37, 28, 29, 15000);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userID` int(7) NOT NULL,
  `empID` int(7) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('User','Division Chief','Supervisor') DEFAULT NULL,
  `createdOn` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `disabledOn` timestamp NULL DEFAULT NULL,
  `updatedOn` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userID`, `empID`, `username`, `password`, `role`, `createdOn`, `disabledOn`, `updatedOn`) VALUES
(15, 1, 'user', '$2b$12$.AoyOH.MGa6Z2wNQGx6ejeX6YXwzPoGwzwuc2qfetYbs28o4ovde.', 'User', '2023-09-07 10:21:13', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(16, 1, 'sample_user', '$2b$12$H47QuTTM/VVaoVO4OEEQV.MFJWkrhd9QSaptkPKqDuZsVlZg7/1yy', 'User', '2023-09-28 11:24:49', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(17, 1, 'supervisor', '$2b$12$0th1zxeeX3InOkM.RG/F4O9fiXPKQeUFi4IpeI0HjLLGoduE2XeZO', 'User', '2023-11-06 02:59:22', NULL, '2023-11-06 02:59:22'),
(18, 1, 'supervisor2', '$2b$12$n5z8DiFIDR7h9hictDQByu8uri/9cvMhlo4dx1gcSoik.lPqw3ykK', 'Supervisor', '2023-11-06 03:07:39', NULL, '2023-11-06 03:07:39'),
(19, 1, 'divChief', '$2b$12$ZF81Bn8zKbpecsPdNdIq7eIGw7Z71SmH3UIUK8b8/jNmeHdAYEjUm', 'Division Chief', '2023-11-07 04:45:26', NULL, '2023-11-07 04:45:26');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`adminID`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `empID` (`empID`);

--
-- Indexes for table `aldp`
--
ALTER TABLE `aldp`
  ADD PRIMARY KEY (`aldpYearID`);

--
-- Indexes for table `aldpproposed_competency`
--
ALTER TABLE `aldpproposed_competency`
  ADD PRIMARY KEY (`apcID`),
  ADD KEY `apID` (`apID`),
  ADD KEY `ID` (`ID`);

--
-- Indexes for table `aldp_competency`
--
ALTER TABLE `aldp_competency`
  ADD PRIMARY KEY (`AC_ID`),
  ADD KEY `compID` (`compID`),
  ADD KEY `aldpID` (`aldpID`);

--
-- Indexes for table `aldp_proposed`
--
ALTER TABLE `aldp_proposed`
  ADD PRIMARY KEY (`apID`),
  ADD KEY `fk_tpID` (`tpID`);

--
-- Indexes for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD PRIMARY KEY (`auditID`);

--
-- Indexes for table `availability`
--
ALTER TABLE `availability`
  ADD PRIMARY KEY (`availID`),
  ADD KEY `pprogID` (`pprogID`),
  ADD KEY `provID` (`provID`);

--
-- Indexes for table `certificates`
--
ALTER TABLE `certificates`
  ADD PRIMARY KEY (`certID`),
  ADD KEY `empID` (`empID`);

--
-- Indexes for table `competency_planned`
--
ALTER TABLE `competency_planned`
  ADD PRIMARY KEY (`compID`),
  ADD KEY `pID` (`pID`);

--
-- Indexes for table `competency_unplanned`
--
ALTER TABLE `competency_unplanned`
  ADD PRIMARY KEY (`reqID`),
  ADD KEY `empID` (`empID`);

--
-- Indexes for table `compreq_competencies`
--
ALTER TABLE `compreq_competencies`
  ADD PRIMARY KEY (`ccID`),
  ADD KEY `compID` (`compID`),
  ADD KEY `reqID` (`reqID`);

--
-- Indexes for table `division`
--
ALTER TABLE `division`
  ADD PRIMARY KEY (`divID`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`empID`),
  ADD UNIQUE KEY `employeeNo` (`employeeNo`),
  ADD KEY `divID` (`divID`);

--
-- Indexes for table `forms`
--
ALTER TABLE `forms`
  ADD PRIMARY KEY (`formID`);

--
-- Indexes for table `forms_content`
--
ALTER TABLE `forms_content`
  ADD PRIMARY KEY (`contentID`),
  ADD KEY `formID` (`formID`);

--
-- Indexes for table `forms_options`
--
ALTER TABLE `forms_options`
  ADD PRIMARY KEY (`optionsID`),
  ADD KEY `contentID` (`contentID`);

--
-- Indexes for table `forms_registration`
--
ALTER TABLE `forms_registration`
  ADD PRIMARY KEY (`formRegID`),
  ADD KEY `empID` (`empID`),
  ADD KEY `aldpID` (`aldpID`);

--
-- Indexes for table `paymentopt`
--
ALTER TABLE `paymentopt`
  ADD PRIMARY KEY (`paymentOptID`),
  ADD KEY `provID` (`provID`);

--
-- Indexes for table `providerprogram`
--
ALTER TABLE `providerprogram`
  ADD PRIMARY KEY (`pprogID`);

--
-- Indexes for table `resourcespeaker`
--
ALTER TABLE `resourcespeaker`
  ADD PRIMARY KEY (`rsID`);

--
-- Indexes for table `scholarship`
--
ALTER TABLE `scholarship`
  ADD PRIMARY KEY (`runningNo`),
  ADD UNIQUE KEY `employeeNo` (`employeeNo`);

--
-- Indexes for table `scholarshiprequest`
--
ALTER TABLE `scholarshiprequest`
  ADD PRIMARY KEY (`sreqID`),
  ADD KEY `empID` (`empID`);

--
-- Indexes for table `sme_affiliation`
--
ALTER TABLE `sme_affiliation`
  ADD PRIMARY KEY (`affilID`),
  ADD KEY `profileID` (`profileID`);

--
-- Indexes for table `sme_educbackground`
--
ALTER TABLE `sme_educbackground`
  ADD PRIMARY KEY (`educID`),
  ADD KEY `profileID` (`profileID`);

--
-- Indexes for table `sme_expertprofile`
--
ALTER TABLE `sme_expertprofile`
  ADD PRIMARY KEY (`profileID`),
  ADD KEY `provID` (`provID`);

--
-- Indexes for table `sme_program`
--
ALTER TABLE `sme_program`
  ADD PRIMARY KEY (`spID`),
  ADD KEY `profileID` (`profileID`),
  ADD KEY `pprogID` (`pprogID`);

--
-- Indexes for table `trainingprovider`
--
ALTER TABLE `trainingprovider`
  ADD PRIMARY KEY (`provID`);

--
-- Indexes for table `trainingprovider_program`
--
ALTER TABLE `trainingprovider_program`
  ADD PRIMARY KEY (`tpID`),
  ADD KEY `provID` (`provID`),
  ADD KEY `pprogID` (`pprogID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userID`),
  ADD KEY `empID` (`empID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `adminID` int(7) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `aldp`
--
ALTER TABLE `aldp`
  MODIFY `aldpYearID` int(7) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `aldpproposed_competency`
--
ALTER TABLE `aldpproposed_competency`
  MODIFY `apcID` int(7) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `aldp_competency`
--
ALTER TABLE `aldp_competency`
  MODIFY `AC_ID` int(7) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `aldp_proposed`
--
ALTER TABLE `aldp_proposed`
  MODIFY `apID` int(7) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `audit_logs`
--
ALTER TABLE `audit_logs`
  MODIFY `auditID` int(7) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6412;

--
-- AUTO_INCREMENT for table `availability`
--
ALTER TABLE `availability`
  MODIFY `availID` int(7) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `certificates`
--
ALTER TABLE `certificates`
  MODIFY `certID` int(7) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `competency_planned`
--
ALTER TABLE `competency_planned`
  MODIFY `compID` int(7) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `competency_unplanned`
--
ALTER TABLE `competency_unplanned`
  MODIFY `reqID` int(7) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `compreq_competencies`
--
ALTER TABLE `compreq_competencies`
  MODIFY `ccID` int(7) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `division`
--
ALTER TABLE `division`
  MODIFY `divID` int(7) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `empID` int(7) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `forms`
--
ALTER TABLE `forms`
  MODIFY `formID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `forms_content`
--
ALTER TABLE `forms_content`
  MODIFY `contentID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `forms_options`
--
ALTER TABLE `forms_options`
  MODIFY `optionsID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `forms_registration`
--
ALTER TABLE `forms_registration`
  MODIFY `formRegID` int(7) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `paymentopt`
--
ALTER TABLE `paymentopt`
  MODIFY `paymentOptID` int(7) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `providerprogram`
--
ALTER TABLE `providerprogram`
  MODIFY `pprogID` int(7) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `resourcespeaker`
--
ALTER TABLE `resourcespeaker`
  MODIFY `rsID` int(7) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `scholarship`
--
ALTER TABLE `scholarship`
  MODIFY `runningNo` int(7) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `scholarshiprequest`
--
ALTER TABLE `scholarshiprequest`
  MODIFY `sreqID` int(7) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `sme_affiliation`
--
ALTER TABLE `sme_affiliation`
  MODIFY `affilID` int(7) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `sme_educbackground`
--
ALTER TABLE `sme_educbackground`
  MODIFY `educID` int(7) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `sme_expertprofile`
--
ALTER TABLE `sme_expertprofile`
  MODIFY `profileID` int(7) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `sme_program`
--
ALTER TABLE `sme_program`
  MODIFY `spID` int(7) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `trainingprovider`
--
ALTER TABLE `trainingprovider`
  MODIFY `provID` int(7) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `trainingprovider_program`
--
ALTER TABLE `trainingprovider_program`
  MODIFY `tpID` int(7) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userID` int(7) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admin`
--
ALTER TABLE `admin`
  ADD CONSTRAINT `admin_ibfk_1` FOREIGN KEY (`empID`) REFERENCES `employees` (`empID`);

--
-- Constraints for table `aldpproposed_competency`
--
ALTER TABLE `aldpproposed_competency`
  ADD CONSTRAINT `aldpproposed_competency_ibfk_1` FOREIGN KEY (`apID`) REFERENCES `aldp_proposed` (`apID`),
  ADD CONSTRAINT `aldpproposed_competency_ibfk_2` FOREIGN KEY (`ID`) REFERENCES `cmis`.`competency` (`ID`);

--
-- Constraints for table `aldp_competency`
--
ALTER TABLE `aldp_competency`
  ADD CONSTRAINT `aldp_competency_ibfk_1` FOREIGN KEY (`compID`) REFERENCES `competency_planned` (`compID`),
  ADD CONSTRAINT `aldp_competency_ibfk_2` FOREIGN KEY (`aldpID`) REFERENCES `aldp` (`aldpYearID`);

--
-- Constraints for table `aldp_proposed`
--
ALTER TABLE `aldp_proposed`
  ADD CONSTRAINT `fk_tpID` FOREIGN KEY (`tpID`) REFERENCES `trainingprovider_program` (`tpID`);

--
-- Constraints for table `availability`
--
ALTER TABLE `availability`
  ADD CONSTRAINT `availability_ibfk_1` FOREIGN KEY (`pprogID`) REFERENCES `providerprogram` (`pprogID`),
  ADD CONSTRAINT `availability_ibfk_2` FOREIGN KEY (`provID`) REFERENCES `trainingprovider` (`provID`);

--
-- Constraints for table `certificates`
--
ALTER TABLE `certificates`
  ADD CONSTRAINT `certificates_ibfk_1` FOREIGN KEY (`empID`) REFERENCES `employees`.`employee` (`empID`);

--
-- Constraints for table `competency_planned`
--
ALTER TABLE `competency_planned`
  ADD CONSTRAINT `competency_planned_ibfk_1` FOREIGN KEY (`pID`) REFERENCES `cmis`.`competency` (`ID`);

--
-- Constraints for table `competency_unplanned`
--
ALTER TABLE `competency_unplanned`
  ADD CONSTRAINT `competencyRequest_ibfk_1` FOREIGN KEY (`empID`) REFERENCES `employees` (`empID`);

--
-- Constraints for table `compreq_competencies`
--
ALTER TABLE `compreq_competencies`
  ADD CONSTRAINT `compReq_Competencies_ibfk_1` FOREIGN KEY (`compID`) REFERENCES `competency_planned` (`compID`),
  ADD CONSTRAINT `compReq_Competencies_ibfk_2` FOREIGN KEY (`reqID`) REFERENCES `competency_unplanned` (`reqID`);

--
-- Constraints for table `forms_content`
--
ALTER TABLE `forms_content`
  ADD CONSTRAINT `forms_content_ibfk_1` FOREIGN KEY (`formID`) REFERENCES `forms` (`formID`);

--
-- Constraints for table `forms_options`
--
ALTER TABLE `forms_options`
  ADD CONSTRAINT `forms_options_ibfk_1` FOREIGN KEY (`contentID`) REFERENCES `forms_content` (`contentID`);

--
-- Constraints for table `forms_registration`
--
ALTER TABLE `forms_registration`
  ADD CONSTRAINT `forms_registration_ibfk_1` FOREIGN KEY (`empID`) REFERENCES `employees` (`empID`),
  ADD CONSTRAINT `forms_registration_ibfk_2` FOREIGN KEY (`aldpID`) REFERENCES `aldp_competency` (`AC_ID`);

--
-- Constraints for table `paymentopt`
--
ALTER TABLE `paymentopt`
  ADD CONSTRAINT `paymentOpt_ibfk_1` FOREIGN KEY (`provID`) REFERENCES `trainingprovider` (`provID`);

--
-- Constraints for table `scholarshiprequest`
--
ALTER TABLE `scholarshiprequest`
  ADD CONSTRAINT `scholarshipRequest_ibfk_1` FOREIGN KEY (`empID`) REFERENCES `employees` (`empID`);

--
-- Constraints for table `sme_affiliation`
--
ALTER TABLE `sme_affiliation`
  ADD CONSTRAINT `SME_affiliation_ibfk_1` FOREIGN KEY (`profileID`) REFERENCES `sme_expertprofile` (`profileID`);

--
-- Constraints for table `sme_educbackground`
--
ALTER TABLE `sme_educbackground`
  ADD CONSTRAINT `SME_educBackground_ibfk_1` FOREIGN KEY (`profileID`) REFERENCES `sme_expertprofile` (`profileID`);

--
-- Constraints for table `sme_expertprofile`
--
ALTER TABLE `sme_expertprofile`
  ADD CONSTRAINT `SME_expertProfile_ibfk_1` FOREIGN KEY (`provID`) REFERENCES `trainingprovider` (`provID`),
  ADD CONSTRAINT `SME_expertProfile_ibfk_2` FOREIGN KEY (`provID`) REFERENCES `trainingprovider` (`provID`);

--
-- Constraints for table `sme_program`
--
ALTER TABLE `sme_program`
  ADD CONSTRAINT `SME_Program_ibfk_1` FOREIGN KEY (`profileID`) REFERENCES `sme_expertprofile` (`profileID`),
  ADD CONSTRAINT `SME_Program_ibfk_2` FOREIGN KEY (`pprogID`) REFERENCES `providerprogram` (`pprogID`);

--
-- Constraints for table `trainingprovider_program`
--
ALTER TABLE `trainingprovider_program`
  ADD CONSTRAINT `trainingprovider_Program_ibfk_1` FOREIGN KEY (`provID`) REFERENCES `trainingprovider` (`provID`),
  ADD CONSTRAINT `trainingprovider_Program_ibfk_2` FOREIGN KEY (`pprogID`) REFERENCES `providerprogram` (`pprogID`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`empID`) REFERENCES `employees` (`empID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
