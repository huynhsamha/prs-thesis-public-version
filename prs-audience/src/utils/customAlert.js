import swal from 'sweetalert';

export const confirmWarning = message => {
  return swal({
    title: 'Xác nhận',
    text: message,
    icon: 'warning',
    buttons: true,
    dangerMode: true
  });
};

export const alertError = message => {
  return swal('Lỗi', message, 'error');
};

export const alertErrorDefault = () => {
  return swal('Lỗi', 'Đã có lỗi xảy ra', 'error');
};

export const alertSuccess = message => {
  return swal('Hoàn tất', message, 'success');
};

export const alertSuccessHTML = html => {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = html;

  return swal({
    title: 'Hoàn tất',
    icon: 'success',
    content: wrapper
  });
};
