const mainContents = [
    {

        key: 'login',
        html: `<form id="login-form" action="./summary.html" class="form login-form">
    <div class="input">
      <input
        required
        type="email"
        placeholder="Email"
        id="email-input"
      /><img
        src="./assets/img/mail.png"
        class="input-icon"
        alt=""
      />
    </div>
    <div class="error-container">
      <div class="error-message" id="email-input-error"></div>
    </div>
    <div class="input">
      <input
        required
        id="password-input"
        type="password"
        placeholder="Password"
      />
      <img
        src="./assets/img/lock.png"
        class="input-icon"
        alt=""
        id="password-icon"
      />
    </div>
    <div class="error-container">
      <div class="error-message" id="password-input-error"></div>
    </div>
    <div class="forgot-password">
      <a href="#" class="text-link">Forgot my password</a>
      <div
        class="d-flex align-items-center"
        id="remember-me-container"
      >
        <svg
          id="remember-me"
          class="checkbox"
          width="24"
          height="25"
          viewBox="0 0 24 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="4"
            y="4.96582"
            width="16"
            height="16"
            rx="3"
            stroke="#2A3647"
            stroke-width="2"
          />
        </svg>
        <span>Remember me</span>
      </div>
    </div>
    <div class="login-buttons">
      <button class="btn btn-primary" type="submit">Log in</button>
      <a href="./summary.html" class="btn btn-secondary">Guest Log in</a>
    </div>
  </form>`,
        heading: 'Log in'
    },
    {
        key: 'signup',
        html: `Blablabla`,
        heading: `Sign up`
    },
    {
        key: 'forgotpassword',
        html: ``,
        heading: 'I forgot my password'
    },
    {
        key: 'resetpassword',
        html: ``,
        heading: 'Reset your password'
    }
]