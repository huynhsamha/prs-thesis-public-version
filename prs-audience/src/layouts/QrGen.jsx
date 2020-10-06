import React from 'react';
import QRCode from 'qrcode.react';
import { rootUrl } from '../config';

class QrGen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      code: '------',
      invalid: false
    }

  }

  componentWillMount() {
    this.check();
  }

  check() {
    const qr = window.location.search;
    const as = qr.split('?code=');
    if (as.length >= 1) {
      const scode = as[1];
      console.log(scode);
      try {
        const code = parseInt(scode, 10)
        console.log(code);
        if (100000 <= code && code <= 999999) {
          this.setState({ code })
        } else {
          this.setState({ invalid: true })
        }
      } catch (err) {
        console.log(err);
        this.setState({ invalid: true })
      }
    } else {
      this.setState({ invalid: true })
    }
  }

  getUrl = () => {
    return rootUrl + '/d/' + this.state.code
  }

  render() {
    return (
      <div className="mt-5">
        <div className="container text-center">
          <h3>Mã QR Code của Session</h3>
          {this.state.invalid &&
            <div className="text-danger mb-4">Mã code không hợp lệ</div>
          }
          <div>Session Code: <code style={{ fontSize: 22 }}>{this.state.code}</code></div>
          <div className="mt-2">Qr Content: <code style={{ fontSize: 14 }}><a href={this.getUrl()}>{this.getUrl()}</a></code></div>

          <div className="mt-3 mb-5">
            <QRCode
              value={this.getUrl()}
              size={360}
              includeMargin={true}
              id="qrcode"
              onContextMenu={e => {
                e.preventDefault();
              }}
            />

            <div className="mt-3" style={{ fontSize: 14 }}><i>Screenshot màn hình để tải mã QR nếu không download được ảnh.</i></div>
          </div>
        </div>
      </div>
    );
  }
}

export default QrGen;
