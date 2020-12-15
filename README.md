Student Name:  Ruairi Byrne   	Student ID: 20091382

Overview
Special needs assistants (SNA) in primary schools currently carry two clickers, one on each hip.  These clickers are used to count the positive or negative categories of behaviours or communications of a child that is being worked with during a given assessment period.  At the end of the school day the SNA manually transfers the tallies from the clickers into a spreadsheet which is then used to build a report over time of the child’s progress and to help determine if the programme being used is working for or against the child.  This information is then used to adjust the programme accordingly.

My proposal is to replace the clickers with an electronic device that the SNA can use to set the category being monitored, eg social behaviour, communications, etc.  The electronic device once set to monitor a behaviour type will then allow the SNA to track positive outcomes by clicking the device once, or negative outcomes by clicking the device twice.

The data from the electronic device will be communicated back to a central device which will load the data into an online database.  This database will then be used to build a dashboard to report the child’s progress on the devised programme.  The online platform will also allow for automated notifications to the teacher on a regular basis, eg weekly so that the teacher can work with the SNA to make programme adjustments.

Tools, Technologies and Equipment

•	A raspberryPi will act as a master/central device which will collect data from a slave device.
•	A puck-js will act as a slave/peripheral device which the SNA will use as a replacement for the clickers.  The puck-js is a BLE device.
•	The puck-js will be programmed using java script.
•	The listener on the raspberryPi will be programmed using python/java script.  It will use MQTT to transfer data to an online storage solution.
•	Data will be stored in a firebase database from where it can be interrogated, and dashboards will be presented.

Project Repository

https://github.com/ruairikbyrne/iotproj

