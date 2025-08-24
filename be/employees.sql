-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 28, 2024 at 12:11 PM
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
-- Database: `employees`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `create_division` (IN `dName` VARCHAR(100), IN `dChief` VARCHAR(100))   BEGIN

INSERT INTO division (
    divisionName, divisionChief
)
VALUES (
    dName, dChief
);

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `create_employee` (IN `eNo` INT, IN `dID` INT, IN `sID` INT, IN `lName` VARCHAR(100), IN `fName` VARCHAR(100), IN `mName` VARCHAR(100), IN `eAdd` VARCHAR(100), IN `sex` ENUM('Female','Male'), IN `estatus` ENUM('Contractual','Probationary','Regular','Resigned','Retracted'), IN `role` VARCHAR(100), IN `salary` VARCHAR(100), IN `bdate` DATE, IN `rel` VARCHAR(100), IN `sNeeds` ENUM('PWD','Immuno-Compromised','None'), IN `dHired` DATE)   BEGIN

INSERT INTO employee (
    employeeNo, divID, sectionID, lastName, firstName, middleName, emailAddress,
    gender, employmentStatus, position, salaryGrade, birthdate, religion,
    specialNeeds, dateHired
)
VALUES (
    eNo, dID, sID, lName, fName, mName, eAdd, sex, estatus, role, salary,
    bdate, rel, sNeeds, dHired
);

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `create_section` (IN `dID` INT, IN `supName` VARCHAR(100))   BEGIN

INSERT INTO section (
    divID, supervisor
)
VALUES (
    dID, supName
);

END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `division`
--

CREATE TABLE `division` (
  `divID` int(7) NOT NULL,
  `divisionName` varchar(100) NOT NULL,
  `divisionChief` varchar(100) NOT NULL,
  `createdOn` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `lastUpdate` datetime NOT NULL,
  `divStatus` enum('Active','Inactive') NOT NULL DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `division`
--

INSERT INTO `division` (`divID`, `divisionName`, `divisionChief`, `createdOn`, `lastUpdate`, `divStatus`) VALUES
(1, 'Managed Security', 'Pedro Basilio', '2023-09-28 04:31:46', '0000-00-00 00:00:00', 'Active'),
(2, 'Marketing', 'Patty Garcia', '2023-09-28 04:32:28', '0000-00-00 00:00:00', 'Active');

-- --------------------------------------------------------

--
-- Table structure for table `employee`
--

CREATE TABLE `employee` (
  `empID` int(7) NOT NULL,
  `employeeNo` int(7) NOT NULL,
  `divID` int(7) NOT NULL,
  `sectionID` int(7) DEFAULT NULL,
  `lastName` varchar(100) NOT NULL,
  `firstName` varchar(100) NOT NULL,
  `middleName` varchar(100) NOT NULL,
  `emailAddress` varchar(100) NOT NULL,
  `gender` enum('Female','Male') NOT NULL,
  `employmentStatus` enum('Contractual','Probationary','Regular','Resigned','Retracted') NOT NULL,
  `position` varchar(100) NOT NULL,
  `salaryGrade` varchar(100) NOT NULL,
  `birthdate` date NOT NULL,
  `religion` varchar(100) DEFAULT NULL,
  `specialNeeds` enum('PWD','Immuno-Compromised','None') DEFAULT NULL,
  `dateHired` date NOT NULL,
  `createdOn` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deactivatedOn` datetime DEFAULT NULL,
  `lastUpdatedOn` datetime NOT NULL DEFAULT current_timestamp(),
  `status` enum('Active','Inactive') DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employee`
--

INSERT INTO `employee` (`empID`, `employeeNo`, `divID`, `sectionID`, `lastName`, `firstName`, `middleName`, `emailAddress`, `gender`, `employmentStatus`, `position`, `salaryGrade`, `birthdate`, `religion`, `specialNeeds`, `dateHired`, `createdOn`, `deactivatedOn`, `lastUpdatedOn`, `status`) VALUES
(1, 1, 1, 1, 'Cuevas', 'Luigi', 'Go', 'luigi@email.com', 'Male', 'Probationary', 'Analyst', '15000', '2000-07-29', 'Catholic', 'None', '2023-09-26', '2023-09-28 04:46:31', NULL, '2023-09-28 12:46:31', 'Active'),
(2, 2, 1, 1, 'Buban', 'Ieya', 'Perez', 'ieya@buban.com', 'Female', 'Regular', 'Network Engineer', '15000', '2000-07-29', 'Catholic', 'None', '2023-09-26', '2023-09-28 09:29:54', NULL, '2023-09-28 17:29:54', 'Active'),
(3, 3, 1, 2, 'Cruz', 'Aldrian', 'Kim', 'cruz@email.com', 'Male', 'Regular', 'System Engineer', '30000', '1999-08-03', 'Christian Born Again', 'Immuno-Compromised', '2022-07-08', '2023-09-28 09:49:00', NULL, '2023-09-28 17:49:00', 'Active'),
(5, 548625, 2, 1, 'Castro', 'Eros', 'Memo', 'eros@email.com', 'Male', 'Regular', 'System Engineer', '30000', '1999-08-03', 'Catholic', 'None', '2022-07-08', '2023-11-07 01:28:10', NULL, '2023-11-07 09:28:10', 'Active');

-- --------------------------------------------------------

--
-- Table structure for table `section`
--

CREATE TABLE `section` (
  `sectionID` int(7) NOT NULL,
  `divID` int(7) NOT NULL,
  `supervisor` varchar(100) NOT NULL,
  `sectionName` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `section`
--

INSERT INTO `section` (`sectionID`, `divID`, `supervisor`, `sectionName`) VALUES
(1, 2, 'Jhomarie Castro', 'Technical Team'),
(2, 1, 'Peter Pan', 'Non-Technical Team');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `division`
--
ALTER TABLE `division`
  ADD PRIMARY KEY (`divID`);

--
-- Indexes for table `employee`
--
ALTER TABLE `employee`
  ADD PRIMARY KEY (`empID`),
  ADD KEY `divID` (`divID`),
  ADD KEY `sectionID` (`sectionID`);

--
-- Indexes for table `section`
--
ALTER TABLE `section`
  ADD PRIMARY KEY (`sectionID`),
  ADD KEY `divID` (`divID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `division`
--
ALTER TABLE `division`
  MODIFY `divID` int(7) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `employee`
--
ALTER TABLE `employee`
  MODIFY `empID` int(7) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `section`
--
ALTER TABLE `section`
  MODIFY `sectionID` int(7) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `employee`
--
ALTER TABLE `employee`
  ADD CONSTRAINT `employee_ibfk_1` FOREIGN KEY (`divID`) REFERENCES `division` (`divID`),
  ADD CONSTRAINT `employee_ibfk_2` FOREIGN KEY (`sectionID`) REFERENCES `section` (`sectionID`);

--
-- Constraints for table `section`
--
ALTER TABLE `section`
  ADD CONSTRAINT `section_ibfk_1` FOREIGN KEY (`divID`) REFERENCES `division` (`divID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
