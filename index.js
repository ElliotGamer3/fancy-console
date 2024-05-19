/**
 * Represents a custom console with log, error, warning, and progress functionalities.
 * @class Console
 * @module Console
 * @version 1.0.0
 * @since 1.0.0
 * @description A custom console with log, error, warning, and progress functionalities for Node.js that provides a running display of log messages and progress bars in the console.
 * @link https://github.com/ElliotGamer3/fancy-console
 * @author Elliot 'ElliotGamer3' Imhoff
 * @license ISC
 * @example
 * const Console = require('./console');
 * Console.log('This is a log message');
 * Console.error('This is an error message');
 * Console.warn('This is a warning message');
 * Console.progress('Task', 50);
 * Console.progress('Task', 100);
 */
class Console {

    static WHITE_TEXT = '\x1b[37m';
    static RED_TEXT = '\x1b[31m';
    static YELLOW_TEXT = '\x1b[33m';
    static GREEN_TEXT = '\x1b[32m';
    static RESET_TEXT = '\x1b[0m';

    static log_queue = [];
    static progress_queue = [];

    /**
     * Updates the progress of a task and displays it in the console.
     * 
     * @param {string} task - The name of the task.
     * @param {number} progress - The progress of the task as a percentage.
     * @returns {void}
     */
    static progress(task, progress) {
        const console_height = process.stdout.rows;
        const console_width = process.stdout.columns;
        const progress_bar_width = console_width - task.length - 8;
        const progress_bar = Array(Math.floor(progress_bar_width * (progress / 100))).fill(`█`).join('');
        const progress_bar_empty = Array(progress_bar_width - progress_bar.length).fill(' ').join('');
        const progress_line = `${progress_bar}${progress_bar_empty}`;
        Console.add_to_progress_queue(task, `${task} [${Console.GREEN_TEXT}${progress_line}${Console.RESET_TEXT}] ${progress}%`);
        Console.update_display();
    }

    /**
     * Adds a message to the log queue.
     * @param {string} message - The message to be added to the log queue.
     * @returns {void}
     */
    static add_to_log_queue(message) {
        const log_height = Math.floor(process.stdout.rows/2);
        while(Console.log_queue.length >= log_height) {
            Console.log_queue.shift();
        }
        Console.log_queue.push(message);
    }

    /**
     * Adds a progress bar to the progress queue or updates an existing progress bar.
     * @param {string} id - The ID of the progress bar.
     * @param {number} progress - The progress value of the progress bar.
     * @returns {void}
     */
    static add_to_progress_queue(id, progress) {
        const progress_height = Math.floor(process.stdout.rows/2);
        Console.progress_queue = Console.progress_queue.filter((progress_bar) => progress_bar.progress < 100);
        while(Console.progress_queue.length >= progress_height) {
            Console.progress_queue.shift();
        }
        for(let i = 0; i < Console.progress_queue.length; i++) {
            if(Console.progress_queue[i].id === id) {
                Console.progress_queue[i].progress = progress;
                return;
            }
        }
        Console.progress_queue.push({id, progress});
        Console.update_display();
    }

    /**
     * Updates the display of the fancy console.
     * This method clears the console and prints the log queue and progress queue.
     * The log queue is printed in the top half of the console, while the progress queue is printed in the bottom half.
     * If the console height is odd, a horizontal line is printed between the two halves.
     * @returns {void}
     */
    static update_display() {
        const console_height = process.stdout.rows;
        const console_width = process.stdout.columns;
        const log_height = Math.floor(console_height/2);
        const progress_height = Math.floor(console_height/2);
        console.clear();
        for(let i = 0; i < log_height; i++) {
            if(i < Console.log_queue.length) {
                console.log(Console.log_queue[i]);
            } else {
                console.log('');
            }
        }
        if (console_height % 2 === 1) {
            console.log('-'.repeat(console_width));
        }
        for(let i = 0; i < progress_height; i++) {
            if(i < Console.progress_queue.length) {
                console.log(Console.progress_queue[i].progress);
            } else {
                console.log('');
            }
        }
    }

    /**
     * Logs a message to the console.
     * @param {string} message - The message to be logged.
     * @returns {void}
     */
    static log(message) {
        Console.add_to_log_queue(`${Console.WHITE_TEXT}${message}${Console.RESET_TEXT}`);
        Console.update_display();
    }
    
    /**
     * Logs an error message to the console.
     * @param {string} message - The error message to be logged.
     * @returns {void}
     */
    static error(message) {
        Console.add_to_log_queue(`${Console.RED_TEXT}${message}${Console.RESET_TEXT}`);
        Console.update_display();
    }

    /**
     * Logs a warning message to the console.
     * @param {string} message - The warning message to be logged.
     * @returns {void}
     */
    static warn(message) {
        Console.add_to_log_queue(`${Console.YELLOW_TEXT}${message}${Console.RESET_TEXT}`);
        Console.update_display();
    }

    /**
     * Displays a success message in the console.
     * @param {string} message - The success message to be displayed.
     * @returns {void}
     */
    static success(message) {
        Console.add_to_log_queue(`${Console.GREEN_TEXT}${message}${Console.RESET_TEXT}`);
        Console.update_display();
    }

    /**
     * Tests the Console class by logging messages to the console.
     * @returns {void}
     */
    static test() {
        for (let i = 0; i <= 10000; i += 1) {
            Console.log(`Test Log ${i}`);
            Console.error(`Test Error ${i}`);
            Console.warn(`Test Warning ${i}`);
            Console.progress(`Test Task`, Math.floor(i / 100));
        }
    }
}

module.exports.default = Console;
module.exports = Console;

