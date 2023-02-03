const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app)
{
    app.use(
        '/trpc',
        createProxyMiddleware({
            target: 'http://localhost:4000',
            changeOrigin: true,
            secure: false
        })
    );

    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://localhost:4000',
            changeOrigin: true,
            secure: false
        })
    );
    
}