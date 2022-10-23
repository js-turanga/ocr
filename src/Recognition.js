'use strict';

/*
 * This file is part of the OCR package.
 *
 * (c) Mark Fluehmann <js.turanga@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const Tesseract = require( 'Tesseract' );
const { createWorker } = Tesseract;

class Recognition {

    /**
     * Create a new class instance.
     *
     * @param {object}  options
     * @constructor
     */
    constructor( logger = null, errorHandler = null) {

        if ( logger = null )
            logger = log => console.log(log)

        if ( errorHandler = null )
            errorHandler = err => console.error(err)

        this.worker = createWorker({
            logger: logger,
            errorHandler: errorHandler,
        });

    }



    /**
     * Set target image
     *
     * @param {string}  image        path to image fila
     * @return $this
     */
    setImage( image ) {
        $this->engine->setImage($image);

        return $this;
    }

    
    /**
     * Get target image
     * 
     * @return string
     */
    getImage()
    {
        return $this->engine->file;
    }


    /**
     * Set target image
     *
     * @param {array} languages
     * @return this
     */
    setLanguages( languages )
    {
        $this->engine->setLanguages($languages);

        return this;
    }


    /**
     * Pass config options to OCR engine
     *
     * @param {array}  config
     * @return this
     */
    setConfig( config )
    {
        $this->engine->setConfig($config);

        return this;
    }


    /**
     * Get OCR Engine config for given option or all
     *
     * @param {string} option
     * @return array
     */
    getConfig( option = null )
    {
        if (! is_null($option) )
            return $this->engine->{$option};

        return $this->engine->getConfig($option);
    }


    /**
     * Get Output Directory
     * 
     * @return string
     */
    setOutputDir()
    {
        if ( function_exists('storage_path') )
            return storage_path('app/ocr');

        return $this->tmpDir;
    }


    /**
     * Get Output Directory
     * 
     * @return string
     */
    getOutputDir()
    {
        return $this->outputDir;
    }


    /**
     * Get OCR Engine version
     *
     * @return string
     */
    getLanguages()
    {
        $lang = $this->engine->languages;

        if ( strlen($lang) == 0 )
            return null;

        return explode('+', $lang);
    }


    /**
     * Run OCR scan process
     *
     * @param {string} $filename
     * @return mixed
     */
    scan( filename = null )
    {
        if ( is_null($filename) )
            $filename = $this->output;

        // build path for output
        $location = $this->buildLocation($filename, 'txt');

        // get recognition results
        if ( $data = $this->engine->scan() ) {

            if ( $this->mode == 'stream' )
                return $data;

            // write scaned file
            file_put_contents($location, $data);

            return $location;
        }
    }


    /**
     * Supported languages
     * 
     * Retrieve supported languages by OCR engine
     *
     * @return array
     */
    supportedLanguages()
    {
        $languages = $this->engine->getLanguages();

        if (! $languages )
            return null;

        return $languages;
    }


    /**
     * Get OCR Engine version
     *
     * @return string
     */
    version()
    {
        return $this->engine->getVersion();
    }


    /**
     * Clean directory, except given file
     * 
     * @param {string}  filename   file not to delete
     * @param {bool}    include    inlude given file for deletion
     */ 
    cleanDirectory( filename = null, include = false )
    {
        // set directory
        $directory = dirname($filename);

        // List of name of files inside specified folder
        $files = glob($directory.'/*'); 

        // Deleting all the files in the list
        foreach($files as $file) {
           
            if( is_file($file) && ( $include || $file !== $filename ) )
            
                // Delete the given file
                unlink($file); 
        }
    }


    /**
     * Build unique location path
     * 
     * @param  string       $filename
     * @return string       $extension
     * @throws exception
     */
    buildLocation( filename, extension = null )
    {
        if (! isset($filename) )
            $filename = $this->uniqueName($extension);

        if ( !is_null($extension) && !strpos($filename, $extension) )
            $filename .= '.'. $extension;

        $location = $this->outputDir . DIRECTORY_SEPARATOR . $filename;

        $directoryPath = dirname($location);

        if (! is_dir($directoryPath))
            mkdir($directoryPath, 0777, true);

        return $location;
    }


   /**
    * Build unique filename with the given extension
    * 
    * @param {string} $extension (pdf / html / jpg )
    * @return {string} $filename
    */
    uniqueName( extension = '' )
    {
        return md5(date('Y-m-d H:i:s:u')) . '.' . $extension;
    }

}

module.exports = Recognition