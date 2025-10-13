![Cover](https://raw.githubusercontent.com/fwd/server/master/.github/banner.png)

# @fwd/server - NodeJS Full-Stack Framework

A powerful, easy-to-use Node.js framework that gives you everything you need to build web applications quickly. Think of it as your Swiss Army knife for web development - it includes a web server, database, file operations, caching, and much more, all in one package.

## 🚀 What Makes This Special?

- **Zero Configuration**: Get started in seconds, not hours
- **Everything Included**: Web server, database, file operations, caching, and more
- **Natural Language**: Use human-friendly syntax for dates, times, and cron jobs
- **Production Ready**: Built-in security features and comprehensive testing
- **Beginner Friendly**: Simple examples that anyone can understand

## 📦 What's Included

- 🌐 **Full Web Server** (ExpressJS) - Handle HTTP requests and responses
- 🔗 **HTTP Client** (Axios) - Make API calls to other services
- 💾 **In-Memory Caching** - Store data temporarily for faster access
- 🗄️ **SQL-Like Database** - Store and query data without complex setup
- 🔐 **UUID Generator** - Create unique identifiers for your data
- 📅 **Smart Date Parsing** - Use natural language like "next friday"
- ⏰ **Timestamps** - Easy time formatting and timezone handling
- 📁 **File Operations** - Read, write, append, and manage files
- ⏲️ **Cron Jobs** - Schedule tasks with natural language
- 🖥️ **Shell Commands** - Run system commands from Node.js

## 🛠️ Installation

```bash
npm install @fwd/server
```

## 🎯 Quick Start (Your First Web App)

Let's build a simple web application that greets visitors:

```js
const server = require('@fwd/server')

// Create a route that responds to GET requests to the homepage
server.get('/', (req, res) => {
    res.send("Hello, World! Welcome to my website!")
})

// Start the server on port 8080
server.start(8080)
```

That's it! Your web server is now running at `http://localhost:8080`. When someone visits your site, they'll see "Hello, World! Welcome to my website!"

> 💡 **Tip**: Static files (like CSS, images, JavaScript) are automatically served from the `/public` folder. You can change this with `server.start(8080, { publicFolder: '/dist' })`.

## 🌟 Real-World Examples

### Example 1: User Registration System

Let's build a complete user registration system:

```js
const server = require('@fwd/server')

// Serve the registration form
server.get('/register', (req, res) => {
    res.send(`
        <form method="POST" action="/register">
            <h2>Create Your Account</h2>
            <input type="text" name="name" placeholder="Your Name" required>
            <input type="email" name="email" placeholder="Your Email" required>
            <button type="submit">Register</button>
        </form>
    `)
})

// Handle the registration form submission
server.post('/register', async (req, res) => {
    const { name, email } = req.body
    
    // Validate email format
    if (!server.isEmail(email)) {
        return res.send("Please enter a valid email address!")
    }
    
    // Create a new user in the database
    const user = await server.database.create('users', {
        id: server.uuid(),           // Generate unique ID
        name: name,
        email: email,
        created_at: server.timestamp() // Current timestamp
    })
    
    res.send(`Welcome ${name}! Your account has been created.`)
})

// View all registered users
server.get('/users', async (req, res) => {
    const users = await server.database.get('users')
    res.send({ users: users })
})

server.start(8080)
```

### Example 2: Blog with File Storage

Create a simple blog that stores posts in files:

```js
const server = require('@fwd/server')

// Display all blog posts
server.get('/', async (req, res) => {
    const posts = await server.list('./posts')
    let html = '<h1>My Blog</h1>'
    
    for (const post of posts) {
        const content = await server.read(`./posts/${post}`)
        html += `<div><h3>${post.replace('.txt', '')}</h3><p>${content}</p></div>`
    }
    
    html += '<a href="/new">Write New Post</a>'
    res.send(html)
})

// Show form to create new post
server.get('/new', (req, res) => {
    res.send(`
        <form method="POST" action="/new">
            <h2>Write New Post</h2>
            <input type="text" name="title" placeholder="Post Title" required>
            <textarea name="content" placeholder="Post Content" required></textarea>
            <button type="submit">Publish Post</button>
        </form>
    `)
})

// Save new blog post
server.post('/new', async (req, res) => {
    const { title, content } = req.body
    
    // Create filename from title (replace spaces with dashes)
    const filename = title.toLowerCase().replace(/\s+/g, '-') + '.txt'
    
    // Save post to file
    await server.write(`./posts/${filename}`, content)
    
    res.send(`Post "${title}" has been published! <a href="/">View all posts</a>`)
})

server.start(8080)
```

### Example 3: API Integration with External Services

Build an app that fetches data from external APIs:

```js
const server = require('@fwd/server')

// Get random joke from external API
server.get('/joke', async (req, res) => {
    try {
        const response = await server.http.get('https://api.chucknorris.io/jokes/random')
        const joke = response.data
        
        res.send(`
            <h2>Random Chuck Norris Joke</h2>
            <p>${joke.value}</p>
            <a href="/joke">Get Another Joke</a>
        `)
    } catch (error) {
        res.send("Sorry, couldn't fetch a joke right now.")
    }
})

// Weather information (example with caching)
server.get('/weather/:city', async (req, res) => {
    const city = req.params.city
    
    // Check if we have cached weather data
    let weather = server.cache(`weather_${city}`)
    
    if (!weather) {
        // Fetch fresh data from API
        try {
            const response = await server.http.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=YOUR_API_KEY`)
            weather = response.data
            
            // Cache for 10 minutes (600 seconds)
            server.cache(`weather_${city}`, weather, 600)
        } catch (error) {
            return res.send(`Could not fetch weather for ${city}`)
        }
    }
    
    res.send(`
        <h2>Weather in ${city}</h2>
        <p>Temperature: ${weather.main.temp}°F</p>
        <p>Description: ${weather.weather[0].description}</p>
    `)
})

server.start(8080)
```

## 🗄️ Database Operations Made Simple

The built-in database works like a simple JSON database - perfect for prototypes and small applications:

```js
const server = require('@fwd/server')

// Create a new record
const user = await server.database.create('users', {
    name: 'John Doe',
    email: 'john@example.com',
    age: 30
})

// Find all users
const allUsers = await server.database.get('users')

// Find users with specific criteria
const youngUsers = await server.database.find('users', { age: { $lt: 25 } })

// Find one specific user
const john = await server.database.findOne('users', { name: 'John Doe' })

// Update a user
await server.database.update('users', john.id, { age: 31 })

// Delete a user
await server.database.remove('users', john.id)
```

## 📁 File Operations

Handle files easily with built-in methods:

```js
const server = require('@fwd/server')

// Read a file
const content = await server.read('./data.txt')
console.log(content)

// Write to a file
await server.write('./output.txt', 'Hello, World!')

// Append to a file
await server.append('./log.txt', 'New log entry\n')

// Prepend to a file (add content at the beginning)
await server.prepend('./notes.txt', 'Important: ')

// Copy a file
await server.copy('./source.txt', './backup.txt')

// Delete a file
await server.unlink('./old-file.txt')

// List files in a directory
const files = await server.list('./documents')
console.log(files) // ['file1.txt', 'file2.txt', 'folder1']
```

## ⏰ Time and Date Magic

Work with dates using natural language:

```js
const server = require('@fwd/server')

// Natural language date parsing
console.log(server.date('next friday'))        // Next Friday's date
console.log(server.date('tomorrow'))           // Tomorrow's date
console.log(server.date('in 3 days'))          // Date 3 days from now
console.log(server.date('last monday'))        // Last Monday's date

// Timestamps
console.log(server.timestamp())                // Current Unix timestamp
console.log(server.timestamp('LLLL'))          // "Monday, September 28, 2020 4:30 PM"
console.log(server.timestamp('LL'))            // "September 28, 2020"
console.log(server.timestamp('LLL', 'America/New_York')) // With timezone

// Time conversions
console.log(server.time(5, 'seconds'))         // 5000 (milliseconds)
console.log(server.time(1, 'hour'))            // 3600000 (milliseconds)
console.log(server.time(2, 'days'))            // 172800000 (milliseconds)
```

## ⏲️ Scheduled Tasks (Cron Jobs)

Schedule tasks using natural language:

```js
const server = require('@fwd/server')

// Run every hour
server.cron(() => {
    console.log('Hourly backup completed')
}, 'every 1 hour')

// Run every 30 minutes
server.cron(() => {
    console.log('Checking for updates...')
}, 'every 30 minutes')

// Run daily at midnight
server.cron(() => {
    console.log('Daily cleanup started')
}, 'every 1 day')

// Run immediately and then every 5 minutes
server.cron(() => {
    console.log('Health check performed')
}, 'every 5 minutes', true) // true = run immediately
```

## 🔐 Generate Unique IDs

Create unique identifiers for your data:

```js
const server = require('@fwd/server')

// Generate a full UUID
const id = server.uuid()
console.log(id) // "9e471b08-38fe-11eb-adc1-0242ac120002"

// Generate a shorter UUID
const shortId = server.uuid(8)
console.log(shortId) // "9e471b08"

// Generate UUID with prefix
const prefixedId = server.uuid(16, 'user_')
console.log(prefixedId) // "user_9e471b08-38fe"

// Generate UUID without dashes
const cleanId = server.uuid(32, '', true)
console.log(cleanId) // "9e471b0838fe11ebadc10242ac120002"
```

## 🖥️ Execute System Commands

Run shell commands from your Node.js application:

```js
const server = require('@fwd/server')

// Get system information
const cpuUsage = await server.exec('top -l 1 | grep "CPU usage"')
console.log(cpuUsage)

// List files in current directory
const files = await server.exec('ls -la')
console.log(files)

// Get disk usage
const diskUsage = await server.exec('df -h')
console.log(diskUsage)

// Execute with options
const result = await server.exec('long-running-command', {
    timeout: 60000,    // 60 second timeout
    maxBuffer: 1024 * 1024 // 1MB buffer limit
})
```

## 💾 Caching for Performance

Store data temporarily to improve performance:

```js
const server = require('@fwd/server')

// Store data in cache
server.cache('user_123', { name: 'John', email: 'john@example.com' })

// Retrieve from cache
const user = server.cache('user_123')
console.log(user) // { name: 'John', email: 'john@example.com' }

// Store with expiration (expires in 300 seconds = 5 minutes)
server.cache('api_data', { data: 'some data' }, 300)

// Cache will automatically expire after 5 minutes
```

## 🔍 Data Validation

Validate user input with built-in validators:

```js
const server = require('@fwd/server')

// Email validation
console.log(server.isEmail('user@example.com'))    // true
console.log(server.isEmail('invalid-email'))       // false

// Phone number validation
console.log(server.isPhone({ value: '555-123-4567' }))  // true
console.log(server.isPhone({ value: '123' }))            // false
```

## 🌐 Advanced Server Configuration

Configure your server with security and performance options:

```js
const server = require('@fwd/server')

server.get('/', (req, res) => {
    res.send('Hello, World!')
})

server.start(8080, './my-app', {
    // Security settings
    cors: {
        origin: ['https://mywebsite.com', 'https://app.mywebsite.com'],
        credentials: true
    },
    
    // File size limits
    jsonLimit: '50mb',
    
    // Timezone for timestamps
    timezone: 'America/New_York',
    
    // Static file settings
    publicFolder: './public',
    maxAge: '1d', // Cache static files for 1 day
    
    // Upload settings
    uploadFolder: './uploads',
    
    // View engine
    viewEngine: 'ejs',
    viewsFolder: './views'
})
```

## 🧪 Testing

The framework includes comprehensive testing to ensure reliability and security. All tests pass to maintain API compatibility.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (reruns when files change)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Test Coverage

The test suite covers:

- ✅ **File Operations** - Read, write, append, prepend, delete, copy, list
- ✅ **Utility Functions** - Command execution, sleep, UUID generation, time/date functions
- ✅ **Validation Functions** - Email and phone number validation
- ✅ **Cron Functionality** - Scheduled task execution
- ✅ **Caching** - Data storage and retrieval with expiration
- ✅ **Server Setup** - HTTP method registration and routing
- ✅ **Integration Tests** - End-to-end functionality testing

### Test Structure

```
__tests__/
├── file-operations.test.js      # File system operations
├── utility-functions.test.js    # Core utility functions
├── validation-functions.test.js  # Input validation
├── cron-functionality.test.js   # Scheduled tasks
├── cache-functionality.test.js  # Caching system
├── server-setup.test.js        # Server configuration
└── integration.test.js          # End-to-end tests
```

## 🔒 Security Features

The framework includes comprehensive security measures to protect your applications:

### 🛡️ Built-in Security Protections

#### **Command Injection Prevention**
- Input validation and sanitization
- Dangerous character filtering (`;&|`$(){}[]\`)
- Command length limits (1000 characters)
- Execution timeouts (30 seconds default)
- Buffer size limits (1MB)

#### **Path Traversal Protection**
- Path normalization and validation
- Prevention of `..` directory traversal attacks
- Secure file operation handling

#### **File Operation Security**
- File size limits (50MB for files, 1MB for append/prepend)
- Input type validation
- Proper error handling without information disclosure

#### **Web Security Headers**
- `X-Frame-Options: DENY` - Prevents clickjacking attacks
- `X-Content-Type-Options: nosniff` - Prevents MIME sniffing attacks
- `X-XSS-Protection: 1; mode=block` - Enables XSS protection
- `Strict-Transport-Security` - Enforces HTTPS connections
- `Content-Security-Policy` - Restricts script and style sources

#### **CORS Security**
- Disabled by default (requires explicit configuration)
- Configurable allowed origins
- Credentials disabled by default

#### **Input Validation**
- Enhanced email validation with length limits (254 characters)
- Improved phone validation with proper error handling
- UUID generation with parameter validation
- Cron job validation with interval limits (1 second minimum)

#### **Resource Protection**
- JSON payload size limits (1GB default, configurable)
- URL-encoded data limits
- Cron interval limits to prevent resource exhaustion

### 🔐 Security Best Practices Implemented

1. **Defense in Depth** - Multiple layers of security controls
2. **Fail Secure** - Default to secure configurations
3. **Input Validation** - Comprehensive validation at all entry points
4. **Error Handling** - Graceful error handling without information disclosure
5. **Resource Limits** - Protection against resource exhaustion attacks

### 🚨 Security Recommendations

When using this framework in production:

1. **Configure CORS properly** - Only allow trusted origins
2. **Set appropriate file size limits** - Based on your application needs
3. **Use HTTPS** - Enable SSL/TLS for secure communications
4. **Validate all inputs** - Use the built-in validators and add custom validation
5. **Monitor logs** - Keep an eye on error logs for suspicious activity
6. **Regular updates** - Keep dependencies updated for security patches

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Report Issues** - Found a bug? Let us know!
2. **Suggest Features** - Have an idea? We'd love to hear it!
3. **Submit Pull Requests** - Fix bugs or add features
4. **Improve Documentation** - Help others learn

### Development Setup

```bash
# Clone the repository
git clone https://github.com/fwd/server.git

# Install dependencies
npm install

# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 📝 License

MIT License - feel free to use this in your projects!

Copyright © [@nano2dev](https://twitter.com/nano2dev).

## ⭐ Show Your Support

Give a ⭐️ if this project helped you! It motivates us to keep improving.

## 📊 Project Stats

[![Stargazers over time](https://starchart.cc/fwd/server.svg)](https://starchart.cc/fwd/server)

---

**Ready to build something amazing?** Start with the Quick Start example above and let your creativity flow! 🚀