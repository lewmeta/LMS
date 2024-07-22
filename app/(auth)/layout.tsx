const AuthLayout = ({
    children
}: { children: React.ReactNode }) => {

    return (
        <div
            className="!h-screen flex items-center bg-blue-600 justify-center"
        >
            {children}
        </div>
    )
}

export default AuthLayout;