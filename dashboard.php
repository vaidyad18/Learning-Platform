<?php
session_start();

if(!isset($_SESSION["loggedin"]) || $_SESSION["loggedin"] !== true){
    header("location: login.php");
    exit;
}

require_once "config.php";

$user_id = $_SESSION["id"];
$enrolled_courses = [];

$sql = "SELECT c.id, c.title, c.category, c.image, c.progress FROM courses c 
        JOIN enrollments e ON c.id = e.course_id 
        WHERE e.user_id = ?";

if($stmt = $mysqli->prepare($sql)){
    $stmt->bind_param("i", $user_id);
    
    if($stmt->execute()){
        $result = $stmt->get_result();
        
        while($row = $result->fetch_assoc()){
            $enrolled_courses[] = $row;
        }
    }
    
    $stmt->close();
}

$recommended_courses = [];

$sql = "SELECT id, title, category, image FROM courses 
        WHERE id NOT IN (SELECT course_id FROM enrollments WHERE user_id = ?) 
        LIMIT 3";

if($stmt = $mysqli->prepare($sql)){
    $stmt->bind_param("i", $user_id);
    
    if($stmt->execute()){
        $result = $stmt->get_result();
        
        while($row = $result->fetch_assoc()){
            $recommended_courses[] = $row;
        }
    }
    
    $stmt->close();
}

$mysqli->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - LearnHub</title>
    <link rel="stylesheet" href="styles.css">
    <style>
        .dashboard {
            padding: 40px 0;
        }
        
        .dashboard-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
        }
        
        .welcome-message h1 {
            margin-bottom: 5px;
        }
        
        .welcome-message p {
            color: var(--secondary-color);
        }
        
        .dashboard-actions {
            display: flex;
            gap: 10px;
        }
        
        .dashboard-grid {
            display: grid;
            grid-template-columns: 7fr 3fr;
            gap: 30px;
        }
        
        .dashboard-main {
            background: white;
            border-radius: 10px;
            padding: 30px;
            box-shadow: var(--box-shadow);
        }
        
        .dashboard-sidebar {
            background: white;
            border-radius: 10px;
            padding: 30px;
            box-shadow: var(--box-shadow);
        }
        
        .section-title {
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .section-title h2 {
            margin-bottom: 0;
        }
        
        .enrolled-courses {
            margin-bottom: 40px;
        }
        
        .course-item {
            display: flex;
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 1px solid var(--border-color);
        }
        
        .course-item:last-child {
            margin-bottom: 0;
            padding-bottom: 0;
            border-bottom: none;
        }
        
        .course-thumbnail {
            width: 120px;
            height: 80px;
            border-radius: 5px;
            overflow: hidden;
            margin-right: 20px;
        }
        
        .course-thumbnail img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .course-info {
            flex: 1;
        }
        
        .course-info h3 {
            margin-bottom: 5px;
        }
        
        .course-category {
            display: inline-block;
            background: var(--light-color);
            padding: 3px 8px;
            border-radius: 20px;
            font-size: 0.8rem;
            margin-bottom: 10px;
        }
        
        .progress-bar {
            height: 8px;
            background: var(--border-color);
            border-radius: 4px;
            margin-top: 10px;
        }
        
        .progress-fill {
            height: 100%;
            background: var(--primary-color);
            border-radius: 4px;
        }
        
        .user-profile {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .user-avatar {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            margin: 0 auto 15px;
            background: var(--light-color);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            color: var(--primary-color);
        }
        
        .user-info h3 {
            margin-bottom: 5px;
        }
        
        .user-info p {
            color: var(--secondary-color);
        }
        
        .stats {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-bottom: 30px;
        }
        
        .stat-card {
            background: var(--light-color);
            padding: 15px;
            border-radius: 5px;
            text-align: center;
        }
        
        .stat-card h4 {
            font-size: 1.5rem;
            margin-bottom: 5px;
        }
        
        .stat-card p {
            color: var(--secondary-color);
            font-size: 0.9rem;
            margin: 0;
        }
        
        .recommended-title {
            margin-bottom: 20px;
        }
        
        .recommended-course {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
            padding-bottom: 15px;
            border-bottom: 1px solid var(--border-color);
        }
        
        .recommended-course:last-child {
            margin-bottom: 0;
            padding-bottom: 0;
            border-bottom: none;
        }
        
        .recommended-thumbnail {
            width: 60px;
            height: 60px;
            border-radius: 5px;
            overflow: hidden;
            margin-right: 15px;
        }
        
        .recommended-thumbnail img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .recommended-info {
            flex: 1;
        }
        
        .recommended-info h4 {
            margin-bottom: 5px;
            font-size: 1rem;
        }
        
        @media (max-width: 992px) {
            .dashboard-grid {
                grid-template-columns: 1fr;
            }
        }
        
        @media (max-width: 768px) {
            .dashboard-header {
                flex-direction: column;
                align-items: flex-start;
            }
            
            .dashboard-actions {
                margin-top: 20px;
            }
            
            .course-item {
                flex-direction: column;
            }
            
            .course-thumbnail {
                width: 100%;
                height: 150px;
                margin-right: 0;
                margin-bottom: 15px;
            }
        }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <div class="logo">
                <h1>LearnHub</h1>
            </div>
            <nav>
    <ul>
        <li><a href="index.html">Home</a></li>
        <li><a href="about.html">About</a></li>
        <li><a href="contact.html">Contact</a></li>
    </ul>
</nav>

            <div class="auth-buttons">
                <a href="profile.php" class="btn">My Profile</a>
                <a href="logout.php" class="btn">Logout</a>
            </div>
            <div class="menu-toggle">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    </header>

    <section class="dashboard">
        <div class="container">
            <div class="dashboard-header">
                <div class="welcome-message">
                    <h1>Welcome back, <?php echo htmlspecialchars($_SESSION["name"]); ?>!</h1>
                    <p>Track your progress and continue learning</p>
                </div>
                <div class="dashboard-actions">
                    <a href="courses.php" class="btn btn-primary">Browse Courses</a>
                    <a href="profile.php" class="btn">My Profile</a>
                </div>
            </div>
            
            <div class="dashboard-grid">
                <div class="dashboard-main">
                    <div class="enrolled-courses">
                        <div class="section-title">
                            <h2>My Courses</h2>
                            <a href="my-courses.php" class="btn btn-outline">View All</a>
                        </div>
                        
                        <?php if(empty($enrolled_courses)): ?>
                            <p>You haven't enrolled in any courses yet. <a href="courses.php">Browse our courses</a> to get started.</p>
                        <?php else: ?>
                            <?php foreach($enrolled_courses as $course): ?>
                                <div class="course-item">
                                    <div class="course-thumbnail">
                                        <img src="<?php echo htmlspecialchars($course['image']); ?>" alt="<?php echo htmlspecialchars($course['title']); ?>">
                                    </div>
                                    <div class="course-info">
                                        <span class="course-category"><?php echo htmlspecialchars($course['category']); ?></span>
                                        <h3><?php echo htmlspecialchars($course['title']); ?></h3>
                                        <div class="progress-bar">
                                            <div class="progress-fill" style="width: <?php echo htmlspecialchars($course['progress']); ?>%"></div>
                                        </div>
                                        <p><?php echo htmlspecialchars($course['progress']); ?>% Complete</p>
                                        <a href="course.php?id=<?php echo htmlspecialchars($course['id']); ?>" class="btn">Continue Learning</a>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </div>
                    
                    <div class="recent-activity">
                        <div class="section-title">
                            <h2>Recent Activity</h2>
                        </div>
                        <p>You haven't had any recent activity. Start learning to see your progress here!</p>
                    </div>
                </div>
                
                <div class="dashboard-sidebar">
                    <div class="user-profile">
                        <div class="user-avatar">
                            <?php echo substr($_SESSION["name"], 0, 1); ?>
                        </div>
                        <div class="user-info">
                            <h3><?php echo htmlspecialchars($_SESSION["name"]); ?></h3>
                            <p><?php echo htmlspecialchars($_SESSION["email"]); ?></p>
                        </div>
                    </div>
                    
                    <div class="stats">
                        <div class="stat-card">
                            <h4><?php echo count($enrolled_courses); ?></h4>
                            <p>Courses</p>
                        </div>
                        <div class="stat-card">
                            <h4>0</h4>
                            <p>Completed</p>
                        </div>
                        <div class="stat-card">
                            <h4>0</h4>
                            <p>Certificates</p>
                        </div>
                        <div class="stat-card">
                            <h4>0h</h4>
                            <p>Learning Time</p>
                        </div>
                    </div>
                    
                    <div class="recommended-courses">
                        <h3 class="recommended-title">Recommended for You</h3>
                        
                        <?php if(empty($recommended_courses)): ?>
                            <p>No recommendations available at this time.</p>
                        <?php else: ?>
                            <?php foreach($recommended_courses as $course): ?>
                                <div class="recommended-course">
                                    <div class="recommended-thumbnail">
                                        <img src="<?php echo htmlspecialchars($course['image']); ?>" alt="<?php echo htmlspecialchars($course['title']); ?>">
                                    </div>
                                    <div class="recommended-info">
                                        <h4><?php echo htmlspecialchars($course['title']); ?></h4>
                                        <span class="course-category"><?php echo htmlspecialchars($course['category']); ?></span>
                                        <a href="course.php?id=<?php echo htmlspecialchars($course['id']); ?>" class="btn btn-small">View</a>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <footer>
        <div class="container">
            <div class="footer-grid">
                <div class="footer-col">
                    <h3>LearnHub</h3>
                    <p>Quality education accessible to everyone, anywhere, anytime.</p>
                    <div class="social-links">
                        <a href="#"><span>Facebook</span></a>
                        <a href="#"><span>Twitter</span></a>
                        <a href="#"><span>Instagram</span></a>
                        <a href="#"><span>LinkedIn</span></a>
                    </div>
                </div>
                <div class="footer-col">
                    <h4>Quick Links</h4>
                    <ul>
        <li><a href="index.html">Home</a></li>
        <li><a href="about.html">About</a></li>
        <li><a href="contact.php">Contact</a></li>
    </ul>
                </div>
                <div class="footer-col">
                    <h4>Support</h4>
                    <ul>
                        <li><a href="faq.html">FAQ</a></li>
                        <li><a href="privacy.html">Privacy Policy</a></li>
                        <li><a href="terms.html">Terms of Service</a></li>
                        <li><a href="help.html">Help Center</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>Contact Us</h4>
                    <p>Email: info@learnhub.com</p>
                    <p>Phone: +1 (555) 123-4567</p>
                    <p>Address: 123 Education St, Learning City, LC 12345</p>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2023 LearnHub. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <script src="script.js"></script>
</body>
</html>