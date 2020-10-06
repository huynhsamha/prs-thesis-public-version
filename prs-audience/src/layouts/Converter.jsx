import React from 'react';
import crypto from 'crypto-js'

import '../assets/scss/converter.scss';

const Web3 = require('web3');
const web3 = new Web3();
const util = web3.utils;

class Converter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ascii: '@hcmut.edu.vn',
      bytes: '4068636d75742e6564752e766e',
      asciiRes: '@hcmut.edu.vn',
      invalid: false,
      rawMd5: 'This is raw content of MD5 Hash Function'
    }
  }

  render() {
    return (
      <div className="converter-page">
        <div className="container">
          <h3>Encode Text to Hex/Bytes</h3>
          <form className="form form-control p-3">
            <label>Text</label>
            <input type="text" defaultValue={this.state.ascii} className="form-control"
              onChange={(ev) => this.setState({ ascii: ev.target.value })} />
            <label>Hex/Bytes</label>
            <input type="text" className="form-control" readOnly value={util.asciiToHex(this.state.ascii)} />
          </form>

          <div className="mt-5 mb-5"></div>
          <h3>Decode Hex/Bytes to Text</h3>
          <form className="form form-control p-3">
            <label>Hex/Bytes</label>
            <div className="prepend-0x">
              <span className="prepend-input">0x</span>
              <input type="text" defaultValue={this.state.bytes} className="form-control"
                onChange={(ev) => {
                  const bytes = ev.target.value;
                  try {
                    const asciiRes = util.hexToAscii('0x' + bytes)
                    this.setState({ bytes, asciiRes, invalid: false })
                  } catch (err) {
                    this.setState({ bytes, asciiRes: '[Invalid Hex/Bytes]', invalid: true })
                  }
                }}
                aria-describedby="addon-hex"
              />
            </div>
            <label>Text</label>
            <input type="text" className={`form-control ${this.state.invalid ? "invalid-data" : ""}`}
              readOnly value={this.state.asciiRes} />
          </form>

          <div className="mt-5 mb-5"></div>
          <h3>MD5 Hash</h3>
          <form className="form form-control p-3">
            <label>Raw Content</label>
            <textarea type="text" defaultValue={this.state.rawMd5} className="form-control"
              onChange={(ev) => this.setState({ rawMd5: ev.target.value })} style={{ padding: 8, marginBottom: 20, height: 150, maxHeight: 200 }} />
            <label>MD5 Hash Value</label>
            <input type="text" className="form-control" readOnly value={crypto.MD5(this.state.rawMd5)} />
          </form>
        </div>
      </div>
    );
  }
}

export default Converter;
