#  3D Models

<!-- TOC -->
* [3D Models](#3d-models)
* [Components](#components)
  * [Main Enclosure](#main-enclosure)
  * [Cupholder](#cupholder)
* [Printing Instructions:](#printing-instructions)
  * [Materials and Equipment](#materials-and-equipment)
  * [Settings](#settings)
  * [Support](#support)
  * [Filament Costs](#filament-costs)
<!-- TOC -->

# Components
The project has 2 main components:
* The main enclosure, that contains the pump and the microcontroller
* A cupholder, to support easier use of the system. 

In the section below you can find both the reasoning and specification of the aforementioned items. Can also skip ahead to the [printing instructions](#printing-instructions).

## Main Enclosure
The main enclosure is designed to contain:
* Arduino Uno Rev 4, Wifi edition
* Arduino Motor shield, that is stacked on top of the Uno
* A small electrical pump

The design leverages a floating "shelve" that has all the components on them. This way we minimize the potential for liquids shortening out electronics. Furthermore it should reduce the overall resonance of the motor, improving quiet operation. The lower 2 holes are for the tubes, that had a diameter of 8 mm. The upper hole is for general access, e.g. if you want to reflash the device.

The Enclosure comes with 2 files:
* enclosure_box.stl
* enclosure_lid.stl

That contain the larger body and a lid to close it off. 

## Cupholder
The cupholder is designed to fascilitate pouring tea into a cup. The design is focussed on having a simple assembly and the least amount of reach into the cup. For this reason the nozzle is angled at 30 degrees to reduce the amount of overhand over the cup, improving access with e.g. a straw. 

The cupholder comes with 2 files:
* cupholder_base.stl
* cupholder_nozzle.stl

The first contains the platform and stem. The nozzle routes the tube towards the cup. Note that for this setup a 8 mm silicone tube was used with inner diameter of 6 mm. The assembly of these part is a simple friction mount of the nozzle on top of the stem. The tube can be route from the back of the base, out and upward of the stem and rounded backdown with the nozzle part. The sequence of assmebly is:
1. Connect Base and Nozzle
2. Route the silicone tubing from the bottom upwards throuch the stem of the base. 
3. Route the remainder, that is coming out of the top of the stem, back into the nozzle part.

The tube should be held in place via simple friction.

# Printing Instructions

## Materials and Equipment

The parts were printed using Transparent PETG filament. Ensure your printing with a Bambu X1 3D printer with a smooth PEI Plate/High Temp Plate. These specific tools were utilized in this process due to their Lidar feature, which is advantageous for this print.

## Settings

Your 3D print settings should be as follows:

- Layer Height: Set your layer height to 0.24 mm. This will determine the quality of your print; smaller values yield higher resolution but take more time.

- First Layer: Set the first layer height to 0.2 mm. This is critical to ensure a good amount of adhesion with the print bed.

- Ironing: Enable ironing for all top surfaces. This option helps in creating a smooth top surface by having the nozzle travel over it a second time.

## Support

Implementing a support structure is vital only for the nozzle for the inside ring that friction mounts to the base. Utilize a tree (auto) type support with the "Tree Strong" style. Further, augment this with 2 layers of rafting to ensure successful print outcomes.

## Filament Costs

Understand the filament use in grams for each component to project your filament costs accurately:

| Part Name         | Filament Cost | Cost in Euros |
|-------------------|---------------|---------------|
| Enclosure, Box    | 126,78 grams  | 3-5 Euros     |
| Enclosure, Lid    | 45,09 grams   | 1-2 Euros     |
| Cupholder, Base   | 57,89 grams   | 1-2 Euros     |
| Cupholder, Nozzle | 7,32 grams    | <1 Euro       |
*\*Assuming that a spool of 1 kg is about 20 to 30 euros*

**Please note:** Times and outcomes may differ based on your specific printer and filament attributes. The above guidelines reflect the settings utilized for this specific print using the Bambu X1 3D printer and Transparent PETG filament.