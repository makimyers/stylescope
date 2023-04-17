import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from './firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import googleFonts from './googleFonts';
import { MouseEvent as ReactMouseEvent } from 'react';

// Import font family-related components and hooks
import { useFontFamily } from './hooks/useFontFamily';
import FontFamilyOptions from './components/FontFamilyOptions';
import generateFontFamilyStyle from './utils/generateFontFamilyStyle';

// Define the props for StyleScope component
interface StyleScopeProps { }

const StyleScope: React.FC<StyleScopeProps> = () => {

    // Initialize font family-related states and functions
    const { headingFont, setHeadingFont, bodyFont, setBodyFont } = useFontFamily();

    // Initialize fontSize state
    const [fontSize, setFontSize] = useState({
        h1: { mobile: 32, desktop: 48 },
        h2: { mobile: 24, desktop: 36 },
        h3: { mobile: 18, desktop: 24 },
        h4: { mobile: 16, desktop: 20 },
        h5: { mobile: 14, desktop: 18 },
        'text-2xl': { mobile: 24, desktop: 28 },
        'text-xl': { mobile: 20, desktop: 24 },
        'text-lg': { mobile: 18, desktop: 20 },
        'text-base': { mobile: 16, desktop: 18 },
        'text-sm': { mobile: 14, desktop: 16 },
        'text-xs': { mobile: 12, desktop: 14 },
    });

    // Initialize lineHeight state
    const [lineHeight, setLineHeight] = useState({
        h1: { mobile: 1, desktop: 1.2 },
        h2: { mobile: 1, desktop: 1.2 },
        h3: { mobile: 1, desktop: 1.2 },
        h4: { mobile: 1, desktop: 1.2 },
        h5: { mobile: 1, desktop: 1.2 },
        'text-2xl': { mobile: 1, desktop: 1.2 },
        'text-xl': { mobile: 1, desktop: 1.2 },
        'text-lg': { mobile: 1, desktop: 1.2 },
        'text-base': { mobile: 1, desktop: 1.2 },
        'text-sm': { mobile: 1, desktop: 1.2 },
        'text-xs': { mobile: 1, desktop: 1.2 },
    });

    // Initialize useNavigate hook for navigation
    const navigate = useNavigate();

    // Fetch data based on the document ID from URL and update the states
    const { docId } = useParams<{ docId: string }>();
    useEffect(() => {
        const fetchData = async () => {
            if (docId) {
                try {
                    const docSnapshot = await db.collection('formData').doc(docId).get();
                    if (docSnapshot.exists) {
                        const data = docSnapshot.data();

                        if (data) {
                            setFontSize(data.fontSize);
                            setLineHeight(data.lineHeight);
                            setColors(data.colors);

                            if (data.headingFont) {
                                setHeadingFont(data.headingFont);
                            }
                            if (data.bodyFont) {
                                setBodyFont(data.bodyFont);
                            }
                        }
                    } else {
                        console.log('No document found with the given ID');
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
        };
        fetchData();
    }, [docId]);

    // Initialize containerWidth state
    const [containerWidth, setContainerWidth] = useState('1536');

    // Initialize visible state for form visibility
    const [visible, setVisible] = useState(false);

    // Handle container width change event
    const handleContainerWidthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setContainerWidth(event.target.value);
    };

    // Initialize newColorName state
    const [newColorName, setNewColorName] = useState('');

    // Define ColorObject type
    type ColorObject = {
        name: string;
        value: string;
        primary: boolean;
    };

    // Initialize colors state
    const [colors, setColors] = useState<ColorObject[]>([
        { name: '50', value: '#fafafa', primary: false },
        { name: '100', value: '#f5f5f5', primary: false },
        { name: '200', value: '#e5e5e5', primary: false },
        { name: '300', value: '#d4d4d4', primary: false },
        { name: '400', value: '#a1a1aa', primary: false },
        { name: '500', value: '#737373', primary: false },
        { name: '600', value: '#525252', primary: false },
        { name: '700', value: '#404040', primary: false },
        { name: '800', value: '#262626', primary: false },
        { name: '900', value: '#171717', primary: false },
        { name: '950', value: '#0a0a0a', primary: false },
        { name: 'Honeydew', value: '#F1FFE7', primary: false },
        { name: 'Light green', value: '#A9FDAC', primary: false },
        { name: 'Emerald', value: '#44CF6C', primary: false },
        { name: 'Zomp', value: '#32A287', primary: false },
        { name: 'Charcoal', value: '#383F51', primary: true },
    ]);

    // Set primary color by updating the colors state
    const setPrimaryColor = (colorName: string) => {
        setColors((prevColors) =>
            prevColors.map((color) =>
                color.name === colorName
                    ? { ...color, primary: true }
                    : { ...color, primary: false }
            )
        );
    };

    // Handle color change event and update the colors state
    const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>, colorName: string) => {
        setColors(colors.map((color) => (color.name === colorName ? { ...color, value: event.target.value } : color)));
    };

    // Add a new color to the colors state
    const addColor = () => {
        if (newColorName.trim()) {
            setColors([...colors, { name: newColorName, value: '', primary: false }]);
            setNewColorName('');
        }
    };

    // Remove a color from the colors state
    const removeColor = (colorName: string) => {
        setColors(colors.filter((color) => color.name !== colorName));
    };

    // Copy color value to clipboard and show a notification
    const copyColorToClipboard = (color: string) => {
        const fallbackCopy = (text: string) => {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                document.execCommand('copy');
                return true;
            } catch (err) {
                console.error('Fallback: Oops, unable to copy', err);
                return false;
            } finally {
                document.body.removeChild(textArea);
            }
        };

        const showNotification = () => {
            toast(`🎨 Copied ${color} to clipboard!`, {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        };

        if (navigator.clipboard) {
            navigator.clipboard.writeText(color).then(() => {
                showNotification();
            });
        } else {
            if (fallbackCopy(color)) {
                showNotification();
            }
        }
    };

    // Toggle form visibility
    const toggleVisibility = () => {
        setVisible(!visible);
    };

    // Close the form when clicking outside of it
    const formRef = useRef(null);
    const handleClickOutside = (event: MouseEvent) => {
        if (formRef.current && !(formRef.current as unknown as Node).contains(event.target as Node)) {
            setVisible(false);

        }
    };

    // Add and remove the event listener for handleClickOutside
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Handle fontSize change event and update the fontSize state
    const handleFontSizeChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        textSize: keyof typeof fontSize,
        screenSize: 'mobile' | 'desktop'
    ) => {
        setFontSize({
            ...fontSize,
            [textSize]: { ...fontSize[textSize], [screenSize]: Number(event.target.value) },
        });
    };

    // Handle lineHeight change event and update the lineHeight state
    const handleLineHeightChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        textSize: keyof typeof lineHeight,
        screenSize: 'mobile' | 'desktop'
    ) => {
        setLineHeight({
            ...lineHeight,
            [textSize]: { ...lineHeight[textSize], [screenSize]: Number(event.target.value) },
        });
    };

    // Force an update to reflect changes on mobile view
    const [forceUpdate, setForceUpdate] = useState(false);
    useEffect(() => {
        const handleResize = () => {
            setForceUpdate((prevState) => !prevState);

        };

        // Add the event listener when the component mounts
        window.addEventListener('resize', handleResize);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Handle form submit event, save data to the database, and navigate to the new URL
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Prepare data to be saved
        const data = {
            colors: colors,
            fontSize: fontSize,
            lineHeight: lineHeight,
            containerWidth: containerWidth,
            headingFont: headingFont,
            bodyFont: bodyFont,
        };

        try {
            // Save the data to the database
            const docRef = await db.collection('formData').add(data);
            console.log('Data saved successfully');
            console.log('Document ID:', docRef.id);

            // Navigate to the new URL with the saved document ID
            navigate('/' + docRef.id);

            // Display a toast notification for the saved style
            const notify = () => toast(`🦄 Style saved ${docRef.id}`, {
                position: "top-center",
                autoClose: 20000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
                theme: "dark",
            });

            notify();

        } catch (error) {
            console.error('Error saving data:', error);
        }
    };

    // Render the StyleScope component
    return (
        <>
            <ToastContainer />

            <button className="toggle !fixed right-10 top-10 h-16 w-16 rounded-full text-white bg-black flex items-center justify-center" onClick={toggleVisibility}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                </svg>
            </button>

            {visible && (
                <div ref={formRef} className="fixed right-0 top-0 bottom-0 right-0 max-w-[400px] h-full overflow-scroll p-6 bg-black z-40">
                    <button className="toggle-2 !fixed right-10 top-10 h-16 w-16 rounded-full text-white bg-white flex items-center justify-center z-50 border-black border-4" onClick={toggleVisibility}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-black">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>

                    </button>

                    <form onSubmit={handleSubmit} className="py-24 mx-auto flex flex-col gap-6">

                        <label className="text-xl border-b border-neutral-600 w-full py-3">Base</label>

                        <FontFamilyOptions
                            headingFont={headingFont}
                            bodyFont={bodyFont}
                            setHeadingFont={setHeadingFont}
                            setBodyFont={setBodyFont}
                            googleFonts={googleFonts}
                        />

                        <div className="flex flex-col gap-2">
                            <label htmlFor="containerWidth">Container max-width (px)</label>
                            <input
                                type="number"
                                className='input'
                                id="containerWidth"
                                value={containerWidth}
                                onChange={handleContainerWidthChange}
                                step="1"
                                min="0"
                            />
                        </div>

                        <label className="text-xl border-b border-neutral-500 w-full py-3">Colours</label>

                        <div className=" flex flex-col gap-2">
                            {colors.map((colorObj) => (
                                <div key={colorObj.name} className="flex flex-row justify-between w-full">

                                    <div className="flex justify-between items-center justify-center gap-2">
                                        <input
                                            type="color"
                                            id={`color-${colorObj.name}`}
                                            value={colorObj.value}
                                            onChange={(event) => handleColorChange(event, colorObj.name)}
                                        />
                                        <label htmlFor={`color-${colorObj.name}`}>{colorObj.name}</label>
                                    </div>

                                    <div className="flex flex-row gap-2">
                                        <button className="text-sm text-white ml-auto button-white" type="button" onClick={() => removeColor(colorObj.name)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>

                                        </button>
                                        <button
                                            className={`text-xs text-white   ${colorObj.primary ? 'button' : 'button-white'
                                                }`}
                                            type="button"
                                            onClick={() => setPrimaryColor(colorObj.name)}
                                        >
                                            {colorObj.primary ? 'Primary' : 'Set as Primary'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-row gap-2 items-center">
                            <label htmlFor="newColorName" className="whitespace-nowrap">Add new</label>
                            <input
                                type="text"
                                className="input w-48"
                                id="newColorName"
                                value={newColorName}
                                onChange={(event) => setNewColorName(event.target.value)}
                                placeholder="Colour name"
                            />
                            <button type="button" onClick={addColor} className="button whitespace-nowrap">
                                Add
                            </button>
                        </div>

                        <label className="text-xl border-b border-neutral-500 w-full py-3">Font sizes</label>

                        <div className="flex flex-col gap-8">
                            {(['h1', 'h2', 'h3', 'h4', 'h5'] as const).map((heading) => (
                                <div key={heading}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="flex flex-col gap-3">
                                            <label>({heading}) Mobile</label>

                                            <div className="flex flex-col gap-2">
                                                <label htmlFor={`fontSize-${heading}-mobile`}>Font size  </label>
                                                <input
                                                    type="number"
                                                    className='input'
                                                    id={`fontSize-${heading}-mobile`}
                                                    value={fontSize[heading].mobile}
                                                    onChange={(event) => handleFontSizeChange(event, heading, 'mobile')}
                                                />
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <label htmlFor={`lineHeight-${heading}-mobile`}>Line height </label>
                                                <input
                                                    type="number"
                                                    className='input'
                                                    id={`lineHeight-${heading}-mobile`}
                                                    value={lineHeight[heading].mobile}
                                                    onChange={(event) => handleLineHeightChange(event, heading, 'mobile')}
                                                    step="0.1"
                                                    min="0"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-3">
                                            <label>({heading}) Desktop</label>
                                            <div className="flex flex-col gap-2">
                                                <label htmlFor={`fontSize-${heading}-desktop`}>Font size  </label>
                                                <input
                                                    type="number"
                                                    className='input'
                                                    id={`fontSize-${heading}-desktop`}
                                                    value={fontSize[heading].desktop}
                                                    onChange={(event) => handleFontSizeChange(event, heading, 'desktop')}
                                                />
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <label htmlFor={`lineHeight-${heading}-desktop`}>Line height </label>
                                                <input
                                                    type="number"
                                                    className='input'
                                                    id={`lineHeight-${heading}-desktop`}
                                                    value={lineHeight[heading].desktop}
                                                    onChange={(event) => handleLineHeightChange(event, heading, 'desktop')}
                                                    step="0.1"
                                                    min="0"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col gap-8">
                            {(['text-2xl', 'text-xl', 'text-lg', 'text-base', 'text-sm', 'text-xs'] as const).map(
                                (textSize) => (
                                    <div key={textSize}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div className="flex flex-col gap-3">
                                                <label>({textSize}) Mobile</label>
                                                <div className="flex flex-col gap-2">
                                                    <label htmlFor={`fontSize-${textSize}-mobile`}>Font size  </label>
                                                    <input
                                                        type="number"
                                                        className='input'
                                                        id={`fontSize-${textSize}-mobile`}
                                                        value={fontSize[textSize].mobile}
                                                        onChange={(event) => handleFontSizeChange(event, textSize, 'mobile')}
                                                    />
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    <label htmlFor={`lineHeight-${textSize}-mobile`}>Line height </label>
                                                    <input
                                                        type="number"
                                                        className='input'
                                                        id={`lineHeight-${textSize}-mobile`}
                                                        value={lineHeight[textSize].mobile}
                                                        onChange={(event) => handleLineHeightChange(event, textSize, 'mobile')}
                                                        step="0.1"
                                                        min="0"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-3">
                                                <label>({textSize}) Desktop</label>
                                                <div className="flex flex-col gap-2">
                                                    <label htmlFor={`fontSize-${textSize}-desktop`}>Font size  </label>
                                                    <input
                                                        type="number"
                                                        className='input'
                                                        id={`fontSize-${textSize}-desktop`}
                                                        value={fontSize[textSize].desktop}
                                                        onChange={(event) => handleFontSizeChange(event, textSize, 'desktop')}
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <label htmlFor={`lineHeight-${textSize}-desktop`}>Line height  </label>
                                                    <input
                                                        type="number"
                                                        className='input'
                                                        id={`lineHeight-${textSize}-desktop`}
                                                        value={lineHeight[textSize].desktop}
                                                        onChange={(event) => handleLineHeightChange(event, textSize, 'desktop')}
                                                        step="0.1"
                                                        min="0"
                                                    />
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                ),
                            )}
                        </div>
                        <button className="button w-full mt-12 h-12 text-xl" type="submit">Save</button>
                    </form>
                </div>)}
            <div className="w-full flex flex-col gap-32 py-32">
                <div className="container mx-auto px-4" style={{ maxWidth: `${containerWidth}px` }}>
                    <h1 style={generateFontFamilyStyle(fontSize, lineHeight, 'h1', 'h1', headingFont)}>
                        Type and Colour
                    </h1>
                </div>

                <div className="container mx-auto px-4" style={{ maxWidth: `${containerWidth}px` }}>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {colors.map((color) => (
                            <div key={color.name} className={`flex flex-col gap-5 text-lg ${color.name}`}>
                                <div
                                    className={`p-12 ${color.name}`}
                                    style={{ backgroundColor: color.value }}
                                ></div>
                                {/*onClick={() => copyColorToClipboard(color.value)}*/}
                                <div className="flex flex-col lg:flex-row justify-between">
                                    <div>{color.name}</div>
                                    <div className="opacity-40">{color.value}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="container mx-auto px-4" style={{ maxWidth: `${containerWidth}px` }}>
                    <div className="flex flex-col gap-10 w-full max-w-3xl">
                        {(['h1', 'h2', 'h3', 'h4', 'h5'] as const).map(
                            (textSize) => (
                                <div className="flex flex-col gap-5" key={textSize}>
                                    <p
                                        style={generateFontFamilyStyle(fontSize, lineHeight, textSize, textSize, headingFont)}
                                    >
                                        Elementum eu facilisis sed odio. Vitae suscipit tellus mauris a diam maecenas sed enim.
                                    </p>
                                    <div className="flex flex-row gap-8 text-lg opacity-40">
                                        <div>{textSize}</div>
                                        <div className="text-black-40">{fontSize[textSize].mobile}px / {fontSize[textSize].desktop}px</div>
                                        <div className="text-black-40">{headingFont}</div>
                                    </div>
                                </div>
                            ),
                        )}
                    </div>
                </div>

                <div className="container mx-auto px-4" style={{ maxWidth: `${containerWidth}px` }}>
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                        {(['text-2xl', 'text-xl', 'text-lg', 'text-base', 'text-sm', 'text-xs'] as const).map(
                            (textSize) => (
                                <div className="flex flex-col gap-5" key={textSize}>
                                    <p
                                        style={generateFontFamilyStyle(fontSize, lineHeight, textSize, textSize, bodyFont)}
                                    >
                                        Elementum eu facilisis sed odio. Vitae suscipit tellus mauris a diam maecenas sed enim.
                                    </p>
                                    <div className="flex flex-row gap-8 text-lg opacity-40">
                                        <div>{textSize}</div>
                                        <div className="text-black-40">{fontSize[textSize].mobile}px / {fontSize[textSize].desktop}px</div>
                                        <div className="text-black-40">{bodyFont}</div>
                                    </div>
                                </div>
                            ),
                        )}
                    </div>
                </div>

                <div className="container mx-auto px-4" style={{ maxWidth: `${containerWidth}px` }}>
                    <div className="flex flex-col w-2/3 gap-6">
                        <h2 style={generateFontFamilyStyle(fontSize, lineHeight, 'h2', 'h2', headingFont)}>
                            (h2) Metus aliquam eleifend mi in.
                        </h2>
                        <p style={generateFontFamilyStyle(fontSize, lineHeight, 'text-base', 'text-base', bodyFont)}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Arcu cursus euismod quis viverra nibh cras. Accumsan lacus vel facilisis volutpat est velit egestas dui. Dignissim cras tincidunt lobortis feugiat vivamus at augue eget. Euismod quis viverra nibh cras pulvinar mattis nunc sed. Auctor urna nunc id cursus. Pulvinar etiam non quam lacus suspendisse faucibus. Augue mauris augue neque gravida in fermentum et sollicitudin ac. Neque aliquam vestibulum morbi blandit. Orci sagittis eu volutpat odio. Iaculis eu non diam phasellus vestibulum lorem sed risus ultricies.
                        </p>
                        <p style={generateFontFamilyStyle(fontSize, lineHeight, 'text-base', 'text-base', bodyFont)}>
                        Phasellus faucibus scelerisque eleifend donec pretium vulputate sapien nec sagittis. Curabitur gravida arcu ac tortor dignissim convallis aenean et. Sed enim ut sem viverra. Ullamcorper dignissim cras tincidunt lobortis feugiat vivamus at augue. Condimentum id venenatis a condimentum. 
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default StyleScope;