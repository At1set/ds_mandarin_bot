import mysql from "mysql"

class DataBase {
  static Instance = null

  constructor(host, user, password, database) {
    if (DataBase.Instance) return DataBase.Instance
    this._connection = mysql
      .createConnection({
        host,
        user,
        password,
        database,
      })
    DataBase.Instance = this
  }

  async connect() {
    if (this._connection.state === "connected") return
    return await new Promise((resolve, reject) => {
      this._connection.connect((error) => {
        if (error) reject(error)
        console.log("Подключение с базой данных установлено!")
        resolve()
      })
    }).catch(err => {throw err})
  }

  async _execute_query(query, values) {
    const result = {
      data: null,
      error: null
    }

    result.data = await new Promise((resolve, reject) => {
      this._connection.query(query, values, (query_err, results, fields) => {
        if (query_err) reject(query_err)
        resolve(results)
      })
    }).catch((err) => {result.error = err; return null})

    return result
  }
}

class TokenDataBase extends DataBase {
  static Instance = null

  constructor(host, user, password, database) {
    super(host, user, password, database)
    if (TokenDataBase.Instance) return TokenDataBase.Instance
    TokenDataBase.Instance = this
  }

  async saveToken(userId, refresh_token, ua, fingerprint, ip, expiresIn) {
    const query = `INSERT INTO \`token_store\` (\`userId\`, \`refresh_token\`, \`ua\`, \`fingerprint\`, \`ip\`, \`expiresIn\`) VALUES ("${userId}", "${refresh_token}", "${ua}", "${fingerprint}", "${ip}", "${expiresIn}");`
    console.log(query);
    return await this._execute_query(
      query
    )
  }

  async findSession(refresh_token) {
    const query = `SELECT * FROM token_store WHERE \`refresh_token\` = "${refresh_token}";`
    return await this._execute_query(
      query
    )
  }

  async findUserSessions(userId) {
    const query = `SELECT * FROM token_store WHERE \`userId\` = "${userId}";`
    return await this._execute_query(
      query
    )
  }

  async removeSession(refresh_token) {
    const query = `DELETE FROM token_store WHERE \`refresh_token\` = "${refresh_token}";`
    return await this._execute_query(
      query
    )
  }
}

export {TokenDataBase}