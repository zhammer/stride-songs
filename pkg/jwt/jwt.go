package jwt

import (
	"fmt"
	"time"

	"github.com/dgrijalva/jwt-go"
	jwtutil "github.com/dgrijalva/jwt-go"
	"github.com/zhammer/stride-songs/internal"
)

var signingMethod = jwtutil.SigningMethodHS256

type Client struct {
	Secret []byte
}

type Claims struct {
	XHasuraUserID int    `json:"x-hasura-user-id"`
	XHasuraRole   string `json:"x-hasura-role"`
	jwtutil.StandardClaims
}

func (c *Client) Build(user internal.User) (string, error) {
	token := jwt.NewWithClaims(signingMethod, Claims{
		XHasuraUserID: user.ID,
		XHasuraRole:   "user",
		StandardClaims: jwtutil.StandardClaims{
			ExpiresAt: time.Now().Add(time.Minute * 60 * 24 * 7).Unix(),
		},
	})
	tokenString, err := token.SignedString(c.Secret)
	if err != nil {
		return "", err
	}
	return tokenString, nil
}

func (c *Client) Parse(tokenString string) (*Claims, error) {
	token, err := jwtutil.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}

		return c.Secret, nil
	})
	if err != nil {
		return nil, err
	}
	if claims, ok := token.Claims.(*Claims); ok && token.Valid {
		return claims, nil
	}
	return nil, fmt.Errorf("invalid claims")

}
