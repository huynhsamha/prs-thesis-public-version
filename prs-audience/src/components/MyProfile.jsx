import React from 'react';

import { Button } from '../antd';
import { confirmWarning, alertSuccess, alertError } from '../utils/customAlert';
import moment from 'moment';
import * as api from '../api';
import * as eth from '../api/eth';
import {
  storeEtherPrivateKey,
  forceGetProfile
} from '../utils/storage';
import Loading from '../components/HorizontalLoading';

import * as drive from '../api/drive';
import LoadingOverlay from 'react-loading-overlay';

class MyProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      showMessageLoading: false,
      messageLoading: '',
      ggDrive: {
        filename: null,
        fileId: null,
      },
      initAndLoadGAPI: null,
      showReloadPermissions: false,
      showLoginGoogleDrive: false
    };

    this.defaultAvatar = '/default-avatar.png';

    this.getProfile().then(profile => {
      this.loadAndInitGoogleDrive().then(() => {
        this.setState({ initAndLoadGAPI: true })
        if (profile.pkFileId) {
          this.pkFileId = profile.pkFileId;
          this.handleIfHavePkFileId(profile.pkFileId);
        }
      }).catch(err => {
        this.setState({ initAndLoadGAPI: false })
      })
    })
  }

  startListenSignInChanges = (onSignIn = () => { }, onSignOut = () => { }) => {
    console.log('startListenSignInChanges');
    drive.listenSignInStatus(isSignIn => {
      console.log('Event isSignIn: ' + isSignIn);
      if (isSignIn) {
        onSignIn();
      } else {
        onSignOut();
      }
    });
  }

  stopListenSignInChanges = () => {
    console.log('stopListenSignInChanges');
    drive.listenSignInStatus(isSignIn => {
    });
  }

  loadAndInitGoogleDrive = () => new Promise((resolve, reject) => {
    console.log('loadAndInitGoogleDrive');
    drive.load(() => {
      drive.initClient().then(() => {
        console.log('Success - loadAndInitGoogleDrive');
        resolve();
      })
        .catch(err => {
          console.log(err);
          reject(err);
        });
    });
  });

  downloadPkFile(pkFileId) {
    console.log('downloadPkFile');
    drive.downloadFile(pkFileId).then((content) => {
      // console.log(content);
      const { address, privateKey } = content;
      storeEtherPrivateKey({ privateKey })
      this.setState({
        showMessageLoading: false,
      })
    }).catch(err => {
      console.log(err);
      this.setState({
        showMessageLoading: false,
      })
      alertError('Backup file chứa thông tin Private Key của bạn trong Google Drive không còn tồn tại nữa. Vui lòng kiểm trạ lại trong Google Drive. Nếu bạn cần tạo lại tài khoản Etherum mới, vui lòng liên hệ quản trị để reset.')
    })
  }

  handleIfHavePkFileId(pkFileId) {
    console.log('handleIfHavePkFileId');
    if (drive.isSignIn()) {
      console.log('isSignIn');
      this.downloadPkFile(pkFileId);
    } else {
      console.log('NOT isSignIn');
      confirmWarning('Ứng dụng cần đăng nhập lại Google Drive để thực hiện các tác vụ đồng bộ Ethereum Account. Bạn có cho phép tác vụ này?').then(ok => {
        if (!ok) {
          this.handleDriveIsNotLogin()
          return;
        }
        // cần login và chờ accept đủ permissions
        this.startListenSignInChanges(() => {
          this.stopListenSignInChanges();
          this.setState({
            showLoginGoogleDrive: false
          })
          this.downloadPkFile(pkFileId);
        }, () => {
          this.stopListenSignInChanges();
          this.handleDriveIsNotLogin()
        })
        drive.doSignIn()
      })
    }
  }

  getProfile = () => new Promise((resolve, reject) => {
    forceGetProfile().then(profile => {
      console.log(profile);
      this.setState({
        user: {
          ...profile,
          joinAt: moment(profile.createdAt).format('DD/MM/YYYY')
        },
        ggDrive: {
          fileId: profile.pkFileId
        }
      });
      resolve(profile)

    }).catch(err => {
      console.log(err);
      alertError('Đã có lỗi trong quá trình lấy profile của bạn')
      reject(err);
    });
  })

  userNoETH() {
    const res = !this.state.user || !this.state.user.address;
    return res;
  }

  createBackupFileInGoogleDrive = () => new Promise((resolve, reject) => {
    console.log('createBackupFileInGoogleDrive');
    this.setState({
      showMessageLoading: true,
      messageLoading: 'Tạo file backup trong Google Drive...'
    });
    const { address, privateKey } = this.payloadETH;
    const data = { address, privateKey };
    const content = JSON.stringify(data, null, 4);
    drive.createFile(content).then(({ filename, fileId }) => {
      console.log('Success createBackupFileInGoogleDrive:');
      console.log(fileId + " " + filename);
      this.setState({
        ggDrive: {
          filename,
          fileId
        }
      });
      resolve({ filename, fileId });
    })
      .catch(err => {
        console.log(err);
        this.handleNotEnoughPermissions();
        // reject(err);
      });
  });

  handleStoreAndUpdateETHAfterCreate({ address, privateKey, pkFileId }) {
    console.log('handleStoreAndUpdateETHAfterCreate');
    console.log('storeEtherPrivateKey');
    storeEtherPrivateKey({ privateKey });
    console.log('API.linkETH');
    api.linkETH({ address, pkFileId }).then(() => {
      return forceGetProfile()
    }).then(() => {
      this.setState({
        showMessageLoading: false
      });
      alertSuccess('Tạo tài khoản và liên kết Ethereum thành công.').then(() => {
        window.location.reload();
      })
    })
      .catch(err => {
        console.log(err);
        this.setState({ showMessageLoading: false })
        alertError('Đã có lỗi trong quá trình liên kết và khởi tạo tài khoản Etherum của bạn');
      });
  }

  handleDriveIsNotLogin = () => {
    this.setState({
      showMessageLoading: false,
    })
    alertError('Ứng dụng không thể truy cập Google Drive để đồng bộ Private Key của bạn.');
    this.setState({ showLoginGoogleDrive: true })
  }

  handleNotEnoughPermissions = () => {
    this.setState({
      showMessageLoading: false,
    })
    alertError('Ứng dụng không có đủ quyền truy cập Google Drive');
    this.setState({ showReloadPermissions: true })
  }

  handleCreateETHAfterSignIn = () => {
    this.createBackupFileInGoogleDrive().then(({ filename, fileId }) => {
      this.setState({
        showMessageLoading: true,
        messageLoading: 'Lưu trữ và khởi tạo Ethereum Account...'
      });
      setTimeout(() => {
        const { address, privateKey } = this.payloadETH;
        return this.handleStoreAndUpdateETHAfterCreate({
          address,
          privateKey,
          pkFileId: fileId
        });
      }, 400);
    })
  }

  handleAcceptCreateETH = () => {
    console.log('handleAcceptCreateETH');
    this.setState({
      showMessageLoading: true,
      messageLoading: 'Yêu cầu truy cập vào Google Drive...'
    });
    setTimeout(() => {
      if (drive.isSignIn()) {
        // đã login rồi, xử lý yêu cầu truy cập
        this.handleCreateETHAfterSignIn();
      } else {
        // cần login và chờ accept đủ permissions
        this.startListenSignInChanges(() => {
          this.stopListenSignInChanges();
          this.handleCreateETHAfterSignIn();
        }, () => {
          this.stopListenSignInChanges();
          this.handleDriveIsNotLogin()
        })
        drive.doSignIn()
      }
    }, 400);
  }

  onClickCreateETH = () => {
    console.log('onClickCreateETH');
    const account = eth.createAccount();
    // console.log(account);
    const { address, privateKey } = account;
    // store
    this.payloadETH = {
      address, privateKey
    }
    confirmWarning(
      `Bạn có muốn tiếp tục tạo tài khoản Etherum?\n
+ ETH Address của bạn là ${address}.\n
+ Private key của bạn là ${privateKey}.\n

Private key sẽ được lưu trữ trong Google Drive của bạn.
Do đó bạn cần cung cấp quyền cho ứng dụng đọc và lưu trữ trong Google Drive của bạn.`
    ).then(ok => {
      if (!ok) return;
      this.handleAcceptCreateETH();
    });
  };

  onClickReloadPermissions = () => {
    this.setState({
      showMessageLoading: true,
      messageLoading: 'Please waiting...'
    })
    drive.doSignOut();
    setTimeout(() => {
      this.setState({
        showMessageLoading: true,
        messageLoading: 'Tải lại trang'
      })
      window.location.reload();
    }, 500)
  }

  onClickLoginGoogleDriveForDownload = () => {
    console.log('onClickLoginGoogleDriveForDownload');
    confirmWarning('Đăng nhập lại Google Drive để đồng bộ Ethereum Account?').then(ok => {
      if (!ok) return;
      this.setState({
        showMessageLoading: true,
        messageLoading: 'Please waiting...'
      })
      // cần login và chờ accept đủ permissions
      this.startListenSignInChanges(() => {
        this.stopListenSignInChanges();
        this.setState({
          showLoginGoogleDrive: false
        })
        this.downloadPkFile(this.pkFileId);
      }, () => {
        this.stopListenSignInChanges();
        this.handleDriveIsNotLogin()
      })
      drive.doSignIn()
    })
  }

  renderButtonCreateETH() {
    return (
      <>
        {this.state.initAndLoadGAPI == true ? (
          <Button type="primary" onClick={this.onClickCreateETH}>
            Tạo và kích hoạt tài khoản Blockchain ETH
          </Button>
        ) : this.state.initAndLoadGAPI == false ? (
          <p className="text-danger">Đã có lỗi trong việc tải Google Drive API</p>
        ) : (
              <Loading visible={true} />
            )}
      </>
    )
  }

  renderNoETH() {
    return (
      <div>
        <p className="mt-3">
          <i>
            Hiện tại bạn chưa kích hoạt tài khoản Blockchain. Hệ thống sử dụng
            nền tảng Blockchain Ethereum. Bạn có thể kích hoạt chức năng này và
            mỗi phản hồi của bạn đều có thể được ghi nhận vào Blockchain nhằm
            đảm bảo tính minh bạch.
          </i>
        </p>
        <div className="mt-4">
          {this.renderButtonCreateETH()}
        </div>
      </div>
    );
  }

  renderExistETH() {
    return (
      <div>
        <p className="mt-3">Tài khoản Blockchain Ethereum của bạn</p>
        <code>
          <a
            href={
              'https://ropsten.etherscan.io/address/' + this.state.user.address
            }
            target="__blank"
          >
            {this.state.user.address}
          </a>
        </code>
        <div className="mt-4">
          <a
            href={`https://drive.google.com/file/d/${this.state.ggDrive.fileId}/view`}
            target="_blank"
            className="ant-btn ant-btn-primary ant-btn-block"
          >
            Xem Private Key trong Google Drive
          </a>
          <div className="mt-3"></div>
          <a
            href={`https://myaccount.google.com/permissions`}
            target="_blank"
            className="ant-btn ant-btn-danger ant-btn-block"
          >
            Quản lý permission của App
          </a>
        </div>
      </div>
    );
  }

  renderMessageLoading() {
    return (
      <LoadingOverlay
        active={this.state.showMessageLoading}
        spinner
        text={this.state.messageLoading}
      ></LoadingOverlay>
    );
  }

  render() {
    return (
      <div className="row">
        <div className="col-12 col-xl-3 col-lg-4">
          <div className="text-center mb-5">
            <img
              src={(this.state.user || {}).avatar || this.defaultAvatar}
              alt="Avatar"
              width={128}
              style={{ borderRadius: '12%' }}
            />
            <hr />
            <h5 className="mt-6">{(this.state.user || {}).displayName}</h5>
            <h6 className="mt-4">
              <i className="fa fa-envelope mr-2" />
              {(this.state.user || {}).email}
            </h6>
            <h6 className="mt-4">
              <i className="fa fa-calendar-alt mr-2" />
              Join: {(this.state.user || {}).joinAt}
            </h6>
          </div>
        </div>
        <div className="col-12 col-xl-9 col-lg-8">
          <div className="text-center">
            <h5>Thông tin tài khoản Blockchain của bạn</h5>
            {this.userNoETH() ? this.renderNoETH() : this.renderExistETH()}
            {/* <div className="mt-4">
              {this.renderButtonCreateETH()}
            </div> */}
            {this.state.showReloadPermissions &&
              <div className="mt-4">
                <Button type="primary" onClick={this.onClickReloadPermissions}>
                  Kiểm tra lại permissions cho App
                </Button>
              </div>
            }
            {this.state.showLoginGoogleDrive &&
              <div className="mt-4">
                <Button type="primary" onClick={this.onClickLoginGoogleDriveForDownload}>
                  Đồng bộ Ethereum Account từ Google Drive
                </Button>
              </div>
            }
          </div>
        </div>
        {this.state.showMessageLoading && this.renderMessageLoading()}
      </div>
    );
  }
}

export default MyProfile;
