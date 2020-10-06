const DefaultInfo = {
  startTime: Date.now(),
  endTime: Date.now()
};

const addInfo = (u = DefaultInfo) => {
  const now = Date.now();
  return {
    ...u,
    isActive: u.startTime <= now && now < u.endTime,
    isComplete: u.endTime <= now
  };
};

export const CompareSession = (a = DefaultInfo, b = DefaultInfo) => {
  const u = addInfo(a);
  const v = addInfo(b);
  if (u.isActive) {
    if (v.isActive) {
      // cả 2 active, thằng nào sắp kết thúc lên trên
      return u.endTime - v.endTime;
    }
    // v đã kết thúc hoặc chưa diễn ra
    // ưu tiên thằng đang active
    return -1;
  }
  if (u.isComplete) {
    if (v.isComplete) {
      // cả 2 cùng kết thúc, ưu tiên thằng kết thúc gần nhất
      return v.endTime - u.endTime;
    }
    // v đang diễn ra hoặc sẽ diễn ra
    // ưu tiên hơn thằng đã kết thúc
    return 1;
  }
  // u sẽ diễn ra
  if (v.isComplete) return -1; // ưu tiên u
  if (v.isActive) return 1; // ưu tiên v
  // cẩ 2 sẽ diễn ra, ưu tiên thằng sớm hơn
  return u.startTime - v.startTime;
};
