function authenticate(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1]; // Get the token from the Authorization header
    if (!token) {
        return res.status(401).json({ message: "Authorization token required" });
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Unauthorized access" });
        }
        req.user = decoded; // Add the decoded user information to the request
        next();
    });
}