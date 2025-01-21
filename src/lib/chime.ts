export default function chime(frequency = 800, duration = 500) {
	const context = new AudioContext();
	const oscillator = context.createOscillator();

	oscillator.type = 'sine'; // Wave type: sine, square, triangle, sawtooth
	oscillator.frequency.setValueAtTime(frequency, context.currentTime); // Frequency in Hz
	oscillator.connect(context.destination);
	oscillator.start();

	setTimeout(() => {
		oscillator.stop();
	}, duration);
}
