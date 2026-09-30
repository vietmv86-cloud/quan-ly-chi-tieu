// ---- Đăng nhập ứng dụng ----

async function loginUser(email, password) {
  const { data, error } = await db.auth.signInWithPassword({
    email: email.trim(),
    password
  });

  if (error) {
    console.error('Lỗi đăng nhập:', error);
    toast('Đăng nhập thất bại: ' + error.message);
    return;
  }

  console.log('Đã đăng nhập:', data.user.email);
  toast('Đăng nhập thành công 💖');
  await loadFromSupabase();
  render();
}

async function logoutUser() {
  const { error } = await db.auth.signOut();

  if (error) {
    console.error('Lỗi đăng xuất:', error);
    toast('Đăng xuất thất bại');
    return;
  }

  toast('Đã đăng xuất');
  render();
}

async function getCurrentUser() {
  const { data, error } = await db.auth.getUser();

  if (error) {
    console.error('Không lấy được user:', error);
    return null;
  }

  return data.user;
}
function loginBox() {
  return `
    <div class="card">
      <h2>🔐 Đăng nhập</h2>

      <input
        id="loginEmail"
        type="email"
        placeholder="Email"
        autocomplete="email"
      >

      <input
        id="loginPassword"
        type="password"
        placeholder="Mật khẩu"
        autocomplete="current-password"
      >

      <button class="b1 full" onclick="doLogin()">
        🔐 Đăng nhập
      </button>
    </div>
  `;
}

async function doLogin() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  await loginUser(email, password);
}
async function saveToSupabase() {
  const user = await getCurrentUser();

  if (!user) {
    console.log('Chưa đăng nhập');
    return false;
  }

  const { error } = await db
    .from('user_data')
    .upsert({
      user_id: user.id,
      data: S
    });

  if (error) {
    console.error('Lỗi lưu Supabase:', error);
    toast('Không lưu được dữ liệu lên cloud');
    return false;
  }

  console.log('Đã lưu dữ liệu lên Supabase');
  return true;
}
async function loadFromSupabase() {
  const user = await getCurrentUser();

  if (!user) {
    console.log('Chưa đăng nhập');
    return false;
  }

  const { data, error } = await db
    .from('user_data')
    .select('data')
    .eq('user_id', user.id)
    .single();

  if (error) {
    console.error('Lỗi đọc Supabase:', error);
    return false;
  }

  if (!data || !data.data) {
    console.log('Chưa có dữ liệu trên cloud');
    return false;
  }

  S = data.data;
  S.v2 = 1;
  persist();

  console.log('Đã tải dữ liệu từ Supabase:', S);
  return true;
}
async function checkLoginUI() {
  const user = await getCurrentUser();

  if (!user) {
    document.body.insertAdjacentHTML('afterbegin', loginBox());
  }
}