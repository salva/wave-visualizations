import numpy as np
import matplotlib.pyplot as plt
import matplotlib.animation as animation

# Wave parameters
amplitude = 1
wavelength = 2 * np.pi
speed = 1
frequency = speed / wavelength
k = 2 * np.pi / wavelength
omega = 2 * np.pi * frequency

# Compute period of the wave
T = 2 * np.pi / omega  # Period of the wave

# Animation settings
fps = 30  # frames per second
cycles = 2  # number of full cycles in the animation
duration = T * cycles  # total duration in seconds
total_frames = int(duration * fps)  # total frames matching the period

# x-axis
x = np.linspace(0, 4 * np.pi, 1000)

# Three specific points to track (non-uniform positions)
x1 = np.pi         # 180 degrees
x2 = 1.3 * np.pi   # ~234 degrees
x3 = 2.2 * np.pi   # ~396 degrees

# Figure and axis
fig, (ax_wave, ax_circle) = plt.subplots(1, 2, figsize=(12, 4))

# --- Wave plot ---
line, = ax_wave.plot(x, np.sin(k * x), label='Traveling Wave')
point1, = ax_wave.plot([], [], 'ro', label='Point 1')
point2, = ax_wave.plot([], [], 'go', label='Point 2')
point3, = ax_wave.plot([], [], 'bo', label='Point 3')

vline1 = ax_wave.axvline(x1, color='r', linestyle='--', alpha=0.5)
vline2 = ax_wave.axvline(x2, color='g', linestyle='--', alpha=0.5)
vline3 = ax_wave.axvline(x3, color='b', linestyle='--', alpha=0.5)

ax_wave.set_ylim(-1.5, 1.5)
ax_wave.set_xlim(0, 4 * np.pi)
ax_wave.set_xlabel('x')
ax_wave.set_ylabel('Amplitude')
ax_wave.set_title('Traveling Wave')
ax_wave.legend(loc='upper right', bbox_to_anchor=(1, 1), frameon=False)

# --- Circle plot ---
circle1 = plt.Circle((0, 0), amplitude, color='r', fill=False, linestyle='--')
circle2 = plt.Circle((0, 0), amplitude, color='g', fill=False, linestyle='--')
circle3 = plt.Circle((0, 0), amplitude, color='b', fill=False, linestyle='--')

particle1, = ax_circle.plot([], [], 'ro')
particle2, = ax_circle.plot([], [], 'go')
particle3, = ax_circle.plot([], [], 'bo')

projection1_line, = ax_circle.plot([], [], 'r--', alpha=0.5)
projection2_line, = ax_circle.plot([], [], 'g--', alpha=0.5)
projection3_line, = ax_circle.plot([], [], 'b--', alpha=0.5)

radius1_line, = ax_circle.plot([], [], 'r-', alpha=0.7)
radius2_line, = ax_circle.plot([], [], 'g-', alpha=0.7)
radius3_line, = ax_circle.plot([], [], 'b-', alpha=0.7)

ax_circle.add_patch(circle1)
ax_circle.add_patch(circle2)
ax_circle.add_patch(circle3)

ax_circle.set_xlim(-1.2, 1.2)
ax_circle.set_ylim(-1.2, 1.2)
ax_circle.set_aspect('equal')
ax_circle.set_title('Circular Motion')
ax_circle.set_xticks([])
ax_circle.set_yticks([])

# Update function for animation
def update(frame):
    t = frame / fps  # simulated time using correct fps
    y = amplitude * np.sin(k * x - omega * t)
    line.set_ydata(y)

    # Update tracked points on the wave
    y1 = amplitude * np.sin(k * x1 - omega * t)
    y2 = amplitude * np.sin(k * x2 - omega * t)
    y3 = amplitude * np.sin(k * x3 - omega * t)
    point1.set_data([x1], [y1])
    point2.set_data([x2], [y2])
    point3.set_data([x3], [y3])

    # Calculate angles for the rotating particles
    theta1 = k * x1 - omega * t
    theta2 = k * x2 - omega * t
    theta3 = k * x3 - omega * t

    # Update rotating particles
    x_circ1 = amplitude * np.cos(theta1)
    y_circ1 = amplitude * np.sin(theta1)
    x_circ2 = amplitude * np.cos(theta2)
    y_circ2 = amplitude * np.sin(theta2)
    x_circ3 = amplitude * np.cos(theta3)
    y_circ3 = amplitude * np.sin(theta3)

    particle1.set_data([x_circ1], [y_circ1])
    particle2.set_data([x_circ2], [y_circ2])
    particle3.set_data([x_circ3], [y_circ3])

    # Vertical projection lines (from particle to x-axis)
    projection1_line.set_data([x_circ1, x_circ1], [y_circ1, 0])
    projection2_line.set_data([x_circ2, x_circ2], [y_circ2, 0])
    projection3_line.set_data([x_circ3, x_circ3], [y_circ3, 0])

    # Radius lines (from center to particle)
    radius1_line.set_data([0, x_circ1], [0, y_circ1])
    radius2_line.set_data([0, x_circ2], [0, y_circ2])
    radius3_line.set_data([0, x_circ3], [0, y_circ3])

    return (line, point1, point2, point3, 
            particle1, particle2, particle3,
            projection1_line, projection2_line, projection3_line,
            radius1_line, radius2_line, radius3_line)

# Create animation with aligned frames to period
ani = animation.FuncAnimation(fig, update, frames=total_frames, interval=1000/fps, blit=True)

ani.save('wave_circle_animation.gif', writer='pillow', fps=fps)
plt.show()
