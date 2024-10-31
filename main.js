const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const clearButton = document.getElementById("clearCanvas");
const toggleModeButton = document.getElementById("toggleMode"); // Button to switch modes
const colorPicker = document.getElementById("colorPicker"); // Color picker

let isDrawing = false;
let points = []; // Array to store points of the current shape
let shapes = []; // Array to store all shapes
let isPointPlacementMode = false; // Toggle for drawing mode
let currentFillColor = colorPicker.value; // Store the selected color

// Start drawing when the mouse is pressed
canvas.addEventListener("mousedown", (event) => {
    if (isPointPlacementMode) {
        // If in point placement mode, add a new point
        points.push({ x: event.offsetX, y: event.offsetY });
        redrawCanvas(); // Redraw to include the new point
    } else {
        // Free drawing mode
        isDrawing = true;
        points = []; // Reset points for the new shape
        points.push({ x: event.offsetX, y: event.offsetY });
    }
});

// Track mouse movements while drawing
canvas.addEventListener("mousemove", (event) => {
    if (isDrawing) {
        points.push({ x: event.offsetX, y: event.offsetY });
        redrawCanvas(); // Redraw all shapes, including the current one
    }
});

// Stop drawing when mouse is released
canvas.addEventListener("mouseup", () => {
    if (isDrawing) {
        isDrawing = false;
        shapes.push([...points]); // Save the current shape points
        fillShape(points); // Fill the newly drawn shape with the selected color
        points = []; // Reset points after finishing the drawing
    }
});

// Function to redraw all shapes
function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    // Redraw all previously saved shapes
    shapes.forEach(shape => {
        drawShape(shape);
        fillShape(shape); // Fill each shape with its stored color
    });

    // Draw the current shape
    if (isDrawing) {
        drawShape(points);
    } else if (isPointPlacementMode && points.length > 0) {
        // Draw the current shape if in point placement mode
        drawShape(points);
        drawPoints(points); // Draw circles around points
    }
};

// Function to draw the shape outline
function drawShape(shape) {
    ctx.beginPath();
    ctx.moveTo(shape[0].x, shape[0].y);

    shape.forEach(point => {
        ctx.lineTo(point.x, point.y);
    });

    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();
}

// Function to fill the shape with the selected color
function fillShape(shape) {
    ctx.beginPath();
    ctx.moveTo(shape[0].x, shape[0].y);

    shape.forEach(point => {
        ctx.lineTo(point.x, point.y);
    });

    ctx.closePath();
    ctx.fillStyle = currentFillColor; // Use the selected color
    ctx.fill();
}

// Function to draw circles around points
function drawPoints(points) {
    ctx.fillStyle = "red"; // Color of the points
    points.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, Math.PI * 2); // Draw a circle with radius 5
        ctx.fill();
    });
}

// Clear the canvas when the button is clicked
clearButton.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    shapes = []; // Clear stored shapes
    points = []; // Clear current shape points
});

// Toggle between drawing modes
toggleModeButton.addEventListener("click", () => {
    isPointPlacementMode = !isPointPlacementMode; // Switch the mode
    toggleModeButton.innerText = isPointPlacementMode ? "Switch to Free Draw" : "Switch to Point Placement"; // Update button text
    if (!isPointPlacementMode) {
        // If switching back to drawing mode, reset points
        points = []; // Clear the points
        isDrawing = false; // Ensure drawing is not active
    }
});

colorPicker.addEventListener("change", () => {
    currentFillColor = colorPicker.value;
});
