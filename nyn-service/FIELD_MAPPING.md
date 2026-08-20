# PDF Field Mapping

Source: original NYN Services Enterprise A4 Consignment Note PDF (two identical
copies per page). Every dynamic field below exists in the original PDF —
no fields were invented, per the project brief. `cnNumber` is the one
addition, since the brief explicitly asks for an auto-generated CN number
overlaid on the document.

| PDF field                     | Data field         | Type            | Notes |
|-------------------------------|---------------------|-----------------|-------|
| (new) CN number                | `cnNumber`          | auto-generated  | `CN-YYYY-XXXXX`, printed top-right |
| IMPORT / EXPORT checkbox       | `shipmentType`      | `IMPORT`\|`EXPORT` | radio in form |
| WESTPORT-KPM / NORTH PORT-KCT  | `portType`           | `WESTPORT`\|`NORTHPORT` | radio in form |
| COLLECTION FROM                | `collectionFrom`    | text (required) | |
| DELIVER TO                     | `deliverTo`         | text (required) | |
| REMARKS                        | `remarks`           | text            | |
| SHIPPING AGENT                 | `shippingAgent`     | text            | |
| ETA DATE                       | `etaDate`           | date            | |
| OPERATOR CODE                  | `operatorCode`      | text            | |
| OPENING DATE                   | `openingDate`       | date            | |
| CONTAINER NO : 1)               | `containerNumber1`  | text (required) | |
| CONTAINER NO : 2)               | `containerNumber2`  | text            | |
| CLOSING DATE                    | `closingDate`       | date            | |
| MT PORT REF                     | `mtPortRef`         | text            | |
| BKG REF                         | `bkgRef`            | text            | used as "Booking Number" in search |
| DISCHARGE TERMINAL              | `dischargeTerminal` | text            | |
| SIZE / TYPE                     | `sizeType`          | text            | |
| VESSEL NAME                     | `vesselName`        | text            | |
| ISSUED BY (stamp)                | — static company stamp image, not user-entered | | |
| DRIVER NAME                      | `driverName`        | text            | |
| IC NO                            | `icNo`              | text            | |
| PRIME MOVER NO                   | `primeMoverNo`      | text            | |
| TRAILER NO                       | `trailerNo`         | text            | |
| SIGNATURE                        | — left blank for wet signature | | |
| DATE (driver details)            | `date`              | date            | also used as the record's "Date" for search/history |

## Static elements (never editable via the form)
Company name/JR number, address, SST number, email, phone, logo, "CONSIGNMENT NOTE"
title, all table borders/labels, and the company stamp image — these are
baked into `ConsignmentNote.jsx` / `print.css`, matching the original PDF.

## Record metadata (not printed, used for storage/search)
`id`, `createdAt`, `updatedAt`, `createdBy` — per project spec section 8.
