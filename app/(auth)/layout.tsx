const AuthLayout = ({
    children
}: { children: React.ReactNode }) => {

    return (
        <div
            className="h-full flex items-center bg-blue-600 justify-center"
        >
            {children}
        </div>
    )
}

export default AuthLayout;