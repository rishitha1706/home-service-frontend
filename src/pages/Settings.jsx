import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Settings() {

    const navigate = useNavigate();

    const [name, setName] = useState(
        sessionStorage.getItem("name") || ""
    );

    const [saved, setSaved] = useState(false);

    const handleSave = () => {

        sessionStorage.setItem("name", name);

        setSaved(true);

        setTimeout(() => {
            setSaved(false);
        }, 2000);
    };

    return (
        <div className="customer-dashboard">

            <header className="dashboard-header">

                <div>
                    <h1>Home Service</h1>
                    <p>Settings</p>
                </div>

                <button
                    onClick={() =>
                        navigate("/customer")
                    }
                >
                    Back
                </button>

            </header>

            <main className="info-page">

                <div className="settings-card">

                    <h2>Settings</h2>

                    <div className="settings-group">

                        <label>
                            Display Name
                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                        />

                    </div>

                    {saved && (
                        <div className="success-message">
                            Settings saved successfully.
                        </div>
                    )}

                    <button
                        className="info-primary-button"
                        onClick={handleSave}
                    >
                        Save Changes
                    </button>

                </div>

            </main>

        </div>
    );
}

export default Settings;