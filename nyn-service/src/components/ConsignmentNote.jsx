import { formatDisplayDate } from '../utils/date';

/**
 * Renders ONE copy of the Consignment Note, laid out to match the original
 * NYN Services Enterprise A4 PDF template field-for-field.
 *
 * See FIELD_MAPPING.md at the project root for the PDF field -> data field
 * mapping this component implements.
 */
function ConsignmentNoteCopy({ data }) {
  const d = data || {};

  const Checkbox = ({ checked }) => (
    <span className="cn-checkbox">{checked ? '\u2611' : '\u2610'}</span>
  );

  return (
    <div className="cn-copy">
      <div className="cn-header">
        <img src="/logo.jpg" alt="NYN Services Enterprise" className="cn-logo" />

        <div className="cn-company-block">
          <div className="cn-company-name">
            NYN SERVICES ENTERPRISE JR0126514-A - (HAULAGE)
          </div>
          <div className="cn-company-line">NO 10 BANDAR ARMANDA PUTRA JALAN SUNGAI CHANDONG</div>
          <div className="cn-company-line">42920 PULAU INDAH SELANGOR DARUL EHSAN MALAYSIA</div>
          <div className="cn-company-line">SST : B10-2404-32000190</div>
          <div className="cn-company-line">Email : Fathiha.nynservices@outlook.com</div>
          <div className="cn-company-line">Tel : 018-5935468 / 016-2642264</div>
          <div className="cn-title">CONSIGNMENT NOTE</div>
        </div>

        <div className="cn-checks">
          <div className="cn-cn-number">{d.cnNumber}</div>
          <div className="cn-check-row">
            <Checkbox checked={d.shipmentType === 'IMPORT'} /> IMPORT
          </div>
          <div className="cn-check-row">
            <Checkbox checked={d.shipmentType === 'EXPORT'} /> EXPORT
          </div>
          <div className="cn-check-row cn-check-spacer">
            <Checkbox checked={d.portType === 'WESTPORT'} /> WESTPORT - KPM
          </div>
          <div className="cn-check-row">
            <Checkbox checked={d.portType === 'NORTHPORT'} /> NORTH PORT - KCT
          </div>
        </div>
      </div>

      <table className="cn-table">
        <tbody>
          <tr>
            <td className="cn-label">COLLECTION FROM</td>
            <td className="cn-value">{d.collectionFrom}</td>
            <td className="cn-label">DELIVER TO :</td>
            <td className="cn-value">{d.deliverTo}</td>
          </tr>
          <tr>
            <td className="cn-label cn-remarks-label">REMARKS :</td>
            <td className="cn-value cn-remarks-value" colSpan={3}>{d.remarks}</td>
          </tr>
          <tr>
            <td className="cn-label">SHIPPING AGENT :</td>
            <td className="cn-value">{d.shippingAgent}</td>
            <td className="cn-label">ETA DATE :</td>
            <td className="cn-value">{formatDisplayDate(d.etaDate)}</td>
          </tr>
          <tr>
            <td className="cn-label">OPERATOR CODE :</td>
            <td className="cn-value">{d.operatorCode}</td>
            <td className="cn-label">OPENING DATE :</td>
            <td className="cn-value">{formatDisplayDate(d.openingDate)}</td>
          </tr>
          <tr>
            <td className="cn-label" rowSpan={2}>CONTAINER NO :</td>
            <td className="cn-value">1) {d.containerNumber1}</td>
            <td className="cn-label">CLOSING DATE :</td>
            <td className="cn-value">{formatDisplayDate(d.closingDate)}</td>
          </tr>
          <tr>
            <td className="cn-value">2) {d.containerNumber2}</td>
            <td className="cn-label">MT PORT REF :</td>
            <td className="cn-value">{d.mtPortRef}</td>
          </tr>
          <tr>
            <td className="cn-label">BKG REF :</td>
            <td className="cn-value">{d.bkgRef}</td>
            <td className="cn-label">DISCHARGE TERMINAL :</td>
            <td className="cn-value">{d.dischargeTerminal}</td>
          </tr>
          <tr>
            <td className="cn-label">SIZE / TYPE :</td>
            <td className="cn-value" colSpan={3}>{d.sizeType}</td>
          </tr>
          <tr>
            <td className="cn-label">VESSEL NAME :</td>
            <td className="cn-value" colSpan={3}>{d.vesselName}</td>
          </tr>
        </tbody>
      </table>

      <div className="cn-footer">
        <div className="cn-issued-by">
          <span>ISSUED BY :</span>
          <img src="/company-stamp.jpg" alt="Company stamp" className="cn-stamp" />
        </div>

        <div className="cn-driver-details">
          <div className="cn-driver-title">DRIVER DETAILS.</div>
          <div className="cn-driver-row"><span>DRIVER NAME :</span><span className="cn-fill">{d.driverName}</span></div>
          <div className="cn-driver-row"><span>IC NO :</span><span className="cn-fill">{d.icNo}</span></div>
          <div className="cn-driver-row"><span>PRIME MOVER NO :</span><span className="cn-fill">{d.primeMoverNo}</span></div>
          <div className="cn-driver-row"><span>TRAILER NO :</span><span className="cn-fill">{d.trailerNo}</span></div>
          <div className="cn-driver-row"><span>SIGNATURE</span><span className="cn-fill"></span></div>
          <div className="cn-driver-row"><span>DATE :</span><span className="cn-fill">{formatDisplayDate(d.date)}</span></div>
        </div>
      </div>
    </div>
  );
}

/**
 * Two identical copies stacked on one A4 page, generated from the SAME
 * data object (per project spec section 14) so a future design change
 * only needs to happen in ConsignmentNoteCopy.
 */
export default function ConsignmentNote({ data }) {
  return (
    <div className="cn-page">
      <ConsignmentNoteCopy data={data} />
      <div className="cn-cut-line" />
      <ConsignmentNoteCopy data={data} />
    </div>
  );
}
