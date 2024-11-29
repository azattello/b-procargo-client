import React, { useEffect, useState } from "react";
import './css/admin.css';
import { getSettings, updateSettings } from '../../action/settings';
import config from "../../config";
import { useSelector } from "react-redux"; // Подключаем useSelector из react-redux

const Settings = () => {
    const [videoLink, setVideoLink] = useState('');
    const [chinaAddress, setChinaAddress] = useState('');
    const [whatsappNumber, setWhatsappNumber] = useState('');
    const [aboutUsText, setAboutUsText] = useState('');
    const [prohibitedItemsText, setProhibitedItemsText] = useState('');
    const [contractFile, setContractFile] = useState(null);
    const [contractFilePath, setContractFilePath] = useState('');
    const [deliveryTime, setDeliveryTime] = useState('');
    const [cargoResponsibility, setCargoResponsibility] = useState('');
    const [settingList, setSettingList] = useState({});
    const userId = useSelector(state => state.user.currentUser.id)
    const role = localStorage.getItem('role')

    // Получаем настройки при загрузке компонента
    useEffect(() => {
         // Получение настроек с сервера
        const fetchSettings = async () => {
            try {
                const allSettings = await getSettings(userId);
                setSettingList(allSettings || {});
                setContractFilePath(allSettings.contractFilePath || '');
            } catch (error) {
                console.error('Ошибка при получении настроек:', error);
            }
        };
        fetchSettings();
    }, [userId]);

   

    useEffect(() => {
        console.log(settingList); // Логируем настройки при изменении
    }, [settingList]);

    // Обработчик для загрузки файла договора
    const handleFileChange = (e) => {
        setContractFile(e.target.files[0]);
    };

    // Отправка формы настроек и файла договора
    const handleSubmit = async (event) => {
        event.preventDefault(); // Предотвращаем перезагрузку страницы

        try {
            // Обновляем текстовые настройки
            if (videoLink !== '' || chinaAddress !== '' || whatsappNumber !== '' || aboutUsText !== '' || prohibitedItemsText !== '' || contractFile !== '' || deliveryTime !== '' || cargoResponsibility !== '') {
                const response = await updateSettings(videoLink, chinaAddress, whatsappNumber, aboutUsText, prohibitedItemsText, contractFile, deliveryTime, cargoResponsibility, userId);
                alert('Данные успешно сохранены:', response);

                // Очищаем поля ввода
                setVideoLink('');
                setChinaAddress('');
                setWhatsappNumber('');
                setAboutUsText('');
                setProhibitedItemsText('');
                setContractFile('');

            } else {
                alert('Все поля пустые');
            }

        } catch (error) {
            alert('Ошибка при сохранении данных:', error);
        }
    };




    return (
        <div className="status-list">
            <h1 className="status-list-title">Дополнительная информация</h1>

            <form className="form-filialAdd" onSubmit={handleSubmit}>
                <div className="inputs-wrapper">
                    <p><b>Ссылка на инструкцию (youtube, vimeo)</b></p>
                    <input
                        className="input-filialAdd"
                        type="text"
                        value={videoLink}
                        onChange={(e) => setVideoLink(e.target.value)}
                        placeholder="Ссылка на инструкцию (youtube, vimeo)"
                    />
                    <p className="settingsGet">
                        {settingList.videoLink || ''}
                    </p>
                </div>

                <div className="inputs-wrapper">
                    <p><b>Адресс китайского склада</b></p>
                    <textarea
                        className="input-filialAdd"
                        type="text"
                        value={chinaAddress}
                        onChange={(e) => setChinaAddress(e.target.value)}
                        placeholder="Адресс китайского склада"
                    />
                    <p className="settingsGet">
                        {settingList.chinaAddress || ''}
                    </p>
                </div>

                <div className="inputs-wrapper">
                    <p><b>Ссылка на ватсап</b></p>
                    <input
                        className="input-filialAdd"
                        type="text"
                        value={whatsappNumber}
                        onChange={(e) => setWhatsappNumber(e.target.value)}
                        placeholder="Ссылка на ватсап"
                    />
                    <p className="settingsGet">
                        {settingList.whatsappNumber || ''}
                    </p>
                </div>

                <div className="inputs-wrapper">
                    <p><b>Текст "О нас"</b></p>
                    <textarea
                        className="input-filialAdd"
                        type="text"
                        value={aboutUsText}
                        onChange={(e) => setAboutUsText(e.target.value)}
                        placeholder='Текст "О нас"'
                    />
                    <p className="settingsGet">
                        {settingList.aboutUsText || ''}
                    </p>
                </div>

                <div className="inputs-wrapper">
                    <p><b>Текст "Товары которые нельзя заказывать"</b></p>
                    <textarea
                        className="input-filialAdd"
                        type="text"
                        value={prohibitedItemsText}
                        onChange={(e) => setProhibitedItemsText(e.target.value)}
                        placeholder='Текст "Товары которые нельзя заказывать"'
                    />
                    <p className="settingsGet">
                        {settingList.prohibitedItemsText || ''}
                    </p>
                </div>

                <div className="inputs-wrapper">
                    <p><b>Сроки доставки и условия</b></p>
                    <textarea
                        className="input-filialAdd"
                        type="text"
                        value={deliveryTime}
                        onChange={(e) => setDeliveryTime(e.target.value)}
                        placeholder='Сроки доставки и условия'
                    />
                    <p className="settingsGet">
                        {settingList.deliveryTime || ''}
                    </p>
                </div>
                
                <div className="inputs-wrapper">
                    <p><b>Ответственность за сохранность груза</b></p>
                    <textarea
                        className="input-filialAdd"
                        type="text"
                        value={cargoResponsibility}
                        onChange={(e) => setCargoResponsibility(e.target.value)}
                        placeholder='Ответственность за сохранность груза'
                    />
                    <p className="settingsGet">
                        {settingList.cargoResponsibility || ''}
                    </p>
                </div>
                {role !== 'filial' && 
                <div className="inputs-wrapper">
                        <p><b>Загрузить договор</b></p>
                        <input type="file" onChange={handleFileChange} />

                        {contractFilePath && (
                            <p>
                                Текущий договор: 
                                <a 
                                    href={`${config.apiUrl}${contractFilePath}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                >
                                    Скачать файл
                                </a>
                            </p>
                        )}

                    </div>
                        
                }
    
                   

         
                <button className="filialAdd-button" type="submit">Сохранить</button>
            </form>
        </div>
    );
};

export default Settings;
