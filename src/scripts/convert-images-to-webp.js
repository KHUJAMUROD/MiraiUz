const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

/**
 * Universal Image to WebP Converter
 * Supports multiple input formats and batch processing
 */

// Default configuration
const DEFAULT_CONFIG = {
  quality: 90, // WebP quality (0-100)
  width: null, // Resize width (null = auto)
  height: null, // Resize height (null = auto)
  fit: 'inside', // Resize fit mode: 'cover', 'contain', 'fill', 'inside', 'outside'
  format: 'webp', // Output format: 'webp', 'jpeg', 'png', 'avif'
  deleteOriginal: false, // Whether to delete original files after conversion
  overwrite: false, // Whether to overwrite existing output files
  recursive: true, // Whether to process subdirectories
  outputRoot: null, // Optional root directory for converted output files
  supportedFormats: ['.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.tif', '.gif', '.svg', '.webp']
};

/**
 * Convert a single image file
 * @param {string} inputPath - Path to input image
 * @param {string} outputPath - Path for output image
 * @param {Object} config - Conversion configuration
 * @returns {Promise<Object>} - Conversion result with stats
 */
async function convertImage(inputPath, outputPath, config = {}) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  try {
    // Check if output file exists and overwrite is disabled
    if (fs.existsSync(outputPath) && !finalConfig.overwrite) {
      return {
        success: false,
        error: 'Output file exists and overwrite is disabled',
        input: path.basename(inputPath),
        output: path.basename(outputPath)
      };
    }

    // Create output directory if it doesn't exist
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Get original file stats
    const originalStats = fs.statSync(inputPath);
    const originalSize = originalStats.size;

    // Start conversion pipeline
    let pipeline = sharp(inputPath);

    // Apply resize if dimensions are specified
    if (finalConfig.width || finalConfig.height) {
      pipeline = pipeline.resize(finalConfig.width, finalConfig.height, {
        fit: finalConfig.fit,
        withoutEnlargement: true
      });
    }

    // Apply format-specific options
    switch (finalConfig.format.toLowerCase()) {
      case 'webp':
        pipeline = pipeline.webp({ quality: finalConfig.quality });
        break;
      case 'jpeg':
      case 'jpg':
        pipeline = pipeline.jpeg({ quality: finalConfig.quality });
        break;
      case 'png':
        pipeline = pipeline.png({ quality: finalConfig.quality });
        break;
      case 'avif':
        pipeline = pipeline.avif({ quality: finalConfig.quality });
        break;
      default:
        throw new Error(`Unsupported output format: ${finalConfig.format}`);
    }

    // Convert and save
    await pipeline.toFile(outputPath);

    // Get output file stats
    const outputStats = fs.statSync(outputPath);
    const outputSize = outputStats.size;
    const reduction = ((1 - outputSize / originalSize) * 100).toFixed(1);

    // Delete original if requested
    if (finalConfig.deleteOriginal && inputPath !== outputPath) {
      fs.unlinkSync(inputPath);
    }

    return {
      success: true,
      input: path.basename(inputPath),
      output: path.basename(outputPath),
      originalSize: (originalSize / 1024).toFixed(2),
      outputSize: (outputSize / 1024).toFixed(2),
      reduction: reduction,
      savedKB: ((originalSize - outputSize) / 1024).toFixed(2)
    };

  } catch (error) {
    return {
      success: false,
      error: error.message,
      input: path.basename(inputPath),
      output: path.basename(outputPath)
    };
  }
}

/**
 * Get file extension (case-insensitive)
 * @param {string} filename - File name
 * @returns {string} - File extension with dot
 */
function getFileExtension(filename) {
  return path.extname(filename).toLowerCase();
}

/**
 * Check if file is a supported image format
 * @param {string} filename - File name
 * @param {Array} supportedFormats - Array of supported extensions
 * @returns {boolean} - Whether file is supported
 */
function isSupportedImage(filename, supportedFormats = DEFAULT_CONFIG.supportedFormats) {
  const ext = getFileExtension(filename);
  return supportedFormats.includes(ext);
}

/**
 * Generate output filename
 * @param {string} inputPath - Input file path
 * @param {string} format - Output format
 * @param {string|null} inputRootDir - Root input directory for relative path
 * @param {string|null} outputRootDir - Root output directory for converted files
 * @returns {string} - Output filename
 */
function generateOutputFilename(inputPath, format = 'webp', inputRootDir = null, outputRootDir = null) {
  const dir = outputRootDir && inputRootDir
    ? path.join(outputRootDir, path.relative(inputRootDir, path.dirname(inputPath)))
    : path.dirname(inputPath);
  const name = path.basename(inputPath, path.extname(inputPath));
  return path.join(dir, `${name}.${format}`);
}

/**
 * Process all images in a directory
 * @param {string} inputDir - Input directory path
 * @param {Object} config - Conversion configuration
 * @returns {Promise<Object>} - Processing results
 */
async function processDirectory(inputDir, config = {}) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const results = {
    total: 0,
    successful: 0,
    failed: 0,
    skipped: 0,
    details: [],
    totalSavedKB: 0
  };

  try {
    if (!fs.existsSync(inputDir)) {
      throw new Error(`Directory does not exist: ${inputDir}`);
    }

    const processFiles = async (dir) => {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const itemPath = path.join(dir, item);
        const stats = fs.statSync(itemPath);

        if (stats.isDirectory() && finalConfig.recursive) {
          // Recursively process subdirectories
          await processFiles(itemPath);
        } else if (stats.isFile() && isSupportedImage(item, finalConfig.supportedFormats)) {
          results.total++;
          
          const outputPath = generateOutputFilename(
            itemPath,
            finalConfig.format,
            inputDir,
            finalConfig.outputRoot
          );
          const result = await convertImage(itemPath, outputPath, finalConfig);
          
          results.details.push(result);
          
          if (result.success) {
            results.successful++;
            results.totalSavedKB += parseFloat(result.savedKB || 0);
            console.log(`✅ ${result.input} → ${result.output} | ${result.originalSize} KB → ${result.outputSize} KB (${result.reduction}% smaller)`);
          } else if (result.error === 'Output file exists and overwrite is disabled') {
            results.skipped++;
            console.log(`⏭️  Skipped: ${result.input} (output exists)`);
          } else {
            results.failed++;
            console.log(`❌ Failed: ${result.input} - ${result.error}`);
          }
        }
      }
    };

    await processFiles(inputDir);
    
    return results;

  } catch (error) {
    console.error('❌ Error processing directory:', error.message);
    return results;
  }
}

/**
 * Process multiple directories
 * @param {Array} directories - Array of directory paths
 * @param {Object} config - Conversion configuration
 * @returns {Promise<Object>} - Combined results
 */
async function processMultipleDirectories(directories, config = {}) {
  const combinedResults = {
    total: 0,
    successful: 0,
    failed: 0,
    skipped: 0,
    totalSavedKB: 0,
    directories: {}
  };

  for (const dir of directories) {
    console.log(`\n📁 Processing directory: ${dir}`);
    const results = await processDirectory(dir, config);
    
    combinedResults.total += results.total;
    combinedResults.successful += results.successful;
    combinedResults.failed += results.failed;
    combinedResults.skipped += results.skipped;
    combinedResults.totalSavedKB += results.totalSavedKB;
    combinedResults.directories[dir] = results;
  }

  return combinedResults;
}

/**
 * CLI usage examples and help
 */
function showUsage() {
  console.log(`
🖼️  Universal Image to WebP Converter

Usage Examples:

1. Convert all images in a single directory:
   node convert-images-to-webp.js /path/to/images

2. Convert with custom quality:
   node convert-images-to-webp.js /path/to/images --quality 80

3. Convert and resize:
   node convert-images-to-webp.js /path/to/images --width 1920 --height 1080

4. Convert to different format:
   node convert-images-to-webp.js /path/to/images --format jpeg

5. Convert multiple directories:
   node convert-images-to-webp.js /path1 /path2 /path3

6. Convert and delete originals:
   node convert-images-to-webp.js /path/to/images --delete-original

7. Overwrite existing files:
   node convert-images-to-webp.js /path/to/images --overwrite

8. Save converted files to a separate directory:
   node convert-images-to-webp.js /path/to/images --output-root /path/to/output

Options:
  --quality <number>     Output quality (0-100, default: 90)
  --width <number>       Resize width (maintains aspect ratio)
  --height <number>      Resize height (maintains aspect ratio)
  --format <string>      Output format: webp, jpeg, png, avif (default: webp)
  --output-root <path>   Save converted files under this root directory
  --delete-original      Delete original files after conversion
  --overwrite           Overwrite existing output files
  --no-recursive        Don't process subdirectories
  --help                Show this help message

Supported input formats: ${DEFAULT_CONFIG.supportedFormats.join(', ')}
`);
}

/**
 * Parse command line arguments
 * @param {Array} args - Command line arguments
 * @returns {Object} - Parsed options and directories
 */
function parseArgs(args) {
  const options = { ...DEFAULT_CONFIG };
  const directories = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '--quality':
        options.quality = parseInt(args[++i]);
        break;
      case '--width':
        options.width = parseInt(args[++i]);
        break;
      case '--height':
        options.height = parseInt(args[++i]);
        break;
      case '--format':
        options.format = args[++i].toLowerCase();
        break;
      case '--output-root':
        options.outputRoot = args[++i];
        break;
      case '--delete-original':
        options.deleteOriginal = true;
        break;
      case '--overwrite':
        options.overwrite = true;
        break;
      case '--no-recursive':
        options.recursive = false;
        break;
      case '--help':
        showUsage();
        process.exit(0);
        break;
      default:
        if (!arg.startsWith('--')) {
          directories.push(arg);
        }
    }
  }

  return { options, directories };
}

// CLI execution
if (require.main === module) {
  const { options, directories } = parseArgs(process.argv.slice(2));
  const normalizedOptions = {
    ...options,
    outputRoot: options.outputRoot ? path.resolve(options.outputRoot) : null
  };
  
  if (directories.length === 0) {
    console.log('❌ No directories specified. Use --help for usage information.');
    process.exit(1);
  }

  console.log('🖼️  Starting image conversion...');
  console.log(`📊 Configuration: ${normalizedOptions.format.toUpperCase()} format, ${normalizedOptions.quality}% quality`);
  if (normalizedOptions.width || normalizedOptions.height) {
    console.log(`📏 Resize: ${normalizedOptions.width || 'auto'}x${normalizedOptions.height || 'auto'}`);
  }
  if (normalizedOptions.outputRoot) {
    console.log(`📁 Output root: ${normalizedOptions.outputRoot}`);
  }
  console.log(`🗂️  Directories: ${directories.join(', ')}\n`);

  processMultipleDirectories(directories, normalizedOptions)
    .then(results => {
      console.log('\n📈 Conversion Summary:');
      console.log(`Total files: ${results.total}`);
      console.log(`✅ Successful: ${results.successful}`);
      console.log(`❌ Failed: ${results.failed}`);
      console.log(`⏭️  Skipped: ${results.skipped}`);
      console.log(`💾 Total space saved: ${results.totalSavedKB.toFixed(2)} KB`);
      
      if (results.successful > 0) {
        console.log('\n🎉 Conversion completed successfully!');
      } else {
        console.log('\n⚠️  No files were converted.');
      }
    })
    .catch(error => {
      console.error('❌ Fatal error:', error.message);
      process.exit(1);
    });
}

// Export functions for programmatic use
module.exports = {
  convertImage,
  processDirectory,
  processMultipleDirectories,
  isSupportedImage,
  generateOutputFilename,
  DEFAULT_CONFIG
}; 