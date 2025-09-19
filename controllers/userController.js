class UserController {
    // dependency injection of the user service
  constructor(userService,tokenService) {
    this.userService = userService;
    this.tokenService=tokenService;
  }

  async register(req, res) {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username, email, and password are required.' });
      }

      const newUser = await this.userService.registerUser({ username, email, password });


      res.status(201).json({ message: 'User registered successfully.', user: newUser });

    } catch (error) {
      res.status(409).json({ message: error.message }); // 409 Conflict
    }
  }

  // handle send cookie with refresh token
  // handle access token in response body
  async login(req, res) {
   try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
      }

      const user = await this.userService.loginUser(email, password);

      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }

      const accessToken = this.tokenService.generateAccessToken(user);
      const refreshToken = this.tokenService.generateRefreshToken(user);

        await this.userService.storeRefreshToken(refreshToken, user.id);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production', // true if productions (https)
        sameSite: 'strict', // Mitigates CSRF attacks
        maxAge: 1 * 24 * 60 * 60 * 1000 
      });

      res.status(200).json({
        message: 'Login successful.',
        accessToken: accessToken,
        user: { // Send back non-sensitive user info
          id: user.id,
          username: user.username,
          email: user.email
        }
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'An internal error occurred.' });
    }
  }


    // Handle the refresh token request
    //  Get the refresh token from the cookie.
    // check over it, it's valid and not expired
    // if valid, create a new access token 
    // send it back to the client
   async refresh(req, res) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token not found.' });
    }

    try {
      const { newAccessToken, user } = await this.userService.refreshUserToken(refreshToken);

      res.status(200).json({
        accessToken: newAccessToken,
        user
      });

    } catch (error) {
      res.clearCookie('refreshToken');
      res.status(403).json({ message: error.message || 'Invalid session.' });
    }
  }

// Handle user logout 
// remove refresh token from database and clear cookie
  async logout(req, res) {
    try {
      const refreshToken = req.cookies.refreshToken;

      await this.userService.logoutUser(refreshToken);

      res.clearCookie('refreshToken');
      res.status(200).json({ message: 'Logged out successfully.' });

    } catch (error) {
      res.clearCookie('refreshToken');
      res.status(500).json({ message: 'An error occurred during logout.' });
    }
  }
}

module.exports = UserController;