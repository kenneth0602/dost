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
-- Database: `cmis`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `create_competency` (IN `comp` VARCHAR(255), IN `specLearning` VARCHAR(255), IN `eID` INT(7), IN `empProfi` ENUM('1.0 - Basic','2.0 - Intermediate','3.0 - Advanced','4.0 - Superior'), IN `reqProfi` ENUM('1.0 - Basic','2.0 - Intermediate','3.0 - Advanced','4.0 - Superior'), IN `prio` ENUM('P1 - Critical','P2 - Helpful','P3 - Unrelated'), IN `method` ENUM('Learning From Experience','Learning From Others','Structured Learning'))   BEGIN

INSERT INTO competency (
    competency, specificLearning, empID, empExistingProficiency, reqProficiency, priority, ld_intervention
)
VALUES (
    comp, specLearning, eID, empProfi, reqProfi, prio, method
);

END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `competency`
--

CREATE TABLE `competency` (
  `ID` int(7) NOT NULL,
  `competency` varchar(255) NOT NULL,
  `specificLearning` varchar(255) NOT NULL,
  `empID` int(7) NOT NULL,
  `empExistingProficiency` enum('1.0 - Basic','2.0 - Intermediate','3.0 - Advanced','4.0 - Superior') NOT NULL,
  `reqProficiency` enum('1.0 - Basic','2.0 - Intermediate','3.0 - Advanced','4.0 - Superior') NOT NULL,
  `priority` enum('P1 - Critical','P2 - Helpful','P3 - Unrelated') NOT NULL,
  `ld_intervention` enum('Learning From Experience','Learning From Others','Structured Learning') DEFAULT NULL,
  `createdOn` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `competency`
--

INSERT INTO `competency` (`ID`, `competency`, `specificLearning`, `empID`, `empExistingProficiency`, `reqProficiency`, `priority`, `ld_intervention`, `createdOn`) VALUES
(1, 'Foreign Language', 'Mandarin', 1, '2.0 - Intermediate', '2.0 - Intermediate', 'P2 - Helpful', 'Structured Learning', '2023-12-06 02:51:26'),
(2, 'Comptia A+', 'Hardware', 2, '2.0 - Intermediate', '2.0 - Intermediate', 'P1 - Critical', 'Learning From Experience', '2023-12-06 02:51:26'),
(3, 'LPI Web Essential', 'Basic Node.js', 2, '3.0 - Advanced', '3.0 - Advanced', 'P1 - Critical', 'Learning From Experience', '2023-12-06 02:51:26'),
(4, 'Test Competency', 'Test Spec', 5, '3.0 - Advanced', '3.0 - Advanced', 'P1 - Critical', 'Structured Learning', '2023-12-06 02:51:26'),
(5, 'Test Competency', 'Test Spec', 5, '3.0 - Advanced', '3.0 - Advanced', 'P1 - Critical', 'Structured Learning', '2023-12-06 02:51:26'),
(6, 'Test 3.0', 'Testing for the nth', 1, '3.0 - Advanced', '3.0 - Advanced', 'P2 - Helpful', 'Structured Learning', '2024-02-16 04:15:42'),
(7, 'Test 4.0', 'Test again', 1, '1.0 - Basic', '2.0 - Intermediate', 'P2 - Helpful', 'Learning From Experience', '2024-02-16 04:16:03');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `competency`
--
ALTER TABLE `competency`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `empID` (`empID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `competency`
--
ALTER TABLE `competency`
  MODIFY `ID` int(7) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `competency`
--
ALTER TABLE `competency`
  ADD CONSTRAINT `competency_ibfk_1` FOREIGN KEY (`empID`) REFERENCES `employees`.`employee` (`empID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
