import React from 'react';

import { Form, Input, Tooltip, Icon, Button } from '../antd';
import { confirmWarning } from '../utils/customAlert';
import moment from 'moment';
import * as api from '../api';
import { getMyProfile } from '../utils/storage';

class MyProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null
    };

    this.defaultAvatar = '/default-avatar.png';

    this.getProfile();
  }

  getProfile() {
    getMyProfile()
      .then(profile => {
        console.log(profile);
        this.setState({
          user: {
            ...profile,
            joinAt: moment(profile.createdAt).format('DD/MM/YYYY')
          }
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return (
      <div className="row">
        <div className="col-12 col-xl-3 col-lg-4">
          <div className="text-center">
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
      </div>
    );
  }
}

export default MyProfile;
