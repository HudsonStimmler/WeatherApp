

package servlets;

import java.sql.*;

/*
 * ChatGPT Code:
 * Prompt: I was told to make a DBConnection class to connect MYSQL to java
 * The database is called WeatherConditions, how do I connect this to java?
 */
public class DBConnection {
    private static final String url = "jdbc:mysql://localhost:3306/WeatherConditions";
    private static final String user = "root"; 
    private static final String password = "root"; 

    public static Connection getConnection() throws SQLException {
        try 
        {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } 
        catch (ClassNotFoundException e) 
        {
            e.printStackTrace();
        }
        return DriverManager.getConnection(url, user, password);
    }
}